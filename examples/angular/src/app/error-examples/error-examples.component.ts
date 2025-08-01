import { Component, inject, OnInit, Input, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MissingService } from './missing-service';
import { ServiceA } from './circular-services';

@Component({
  selector: 'app-error-examples',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-examples">
      <h3>Angular Error Examples</h3>

      <div class="error-section">
        <h4>1. Runtime TypeError</h4>
        <button (click)="triggerRuntimeError()">Trigger Error</button>
        <p>Counter: {{ counter }}</p>
      </div>

      <div class="error-section">
        <h4>2. Circular Dependency Error</h4>
        <button (click)="triggerCircularDependency()">Trigger Error</button>
      </div>

      <div class="error-section">
        <h4>3. Missing Provider Error</h4>
        <button (click)="useMissingService()">Trigger Error</button>
      </div>

      <div class="error-section">
        <h4>4. Template Parsing Error</h4>
        <button (click)="showTemplateError = !showTemplateError">Toggle Template Error</button>
        @if (showTemplateError) {
          <!-- This will cause an error: accessing undefined property -->
          <p>{{ undefinedObject.property }}</p>
        }
      </div>

      <div class="error-section">
        <h4>5. HTTP Error (404)</h4>
        <button (click)="trigger404Error()">Trigger 404</button>
      </div>

      <div class="error-section">
        <h4>6. Type Error in Template</h4>
        <button (click)="triggerTypeError()">Trigger Type Error</button>
        @if (showTypeError) {
          <p>{{ nullValue.toString() }}</p>
        }
      </div>

      <div class="error-section">
        <h4>7. Memory Leak (Unsubscribed Observable)</h4>
        <button (click)="createMemoryLeak()">Create Memory Leak</button>
        <p>Intervals created: {{ intervalCount }}</p>
      </div>

      <div class="error-section">
        <h4>8. Infinite Loop in Getter</h4>
        <button (click)="showInfiniteLoop = !showInfiniteLoop">Toggle Infinite Loop</button>
        @if (showInfiniteLoop) {
          <p>Random value: {{ problematicGetter }}</p>
        }
      </div>

      <div class="error-section">
        <h4>10. Async Error in Lifecycle Hook</h4>
        <button (click)="reloadComponent()">Reload Component</button>
      </div>
    </div>
  `,
  styles: [`
    .error-examples {
      margin: 20px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error-section {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    .error-section h4 {
      margin-top: 0;
      color: #333;
    }
    button {
      padding: 8px 16px;
      background-color: #d32f2f;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }
    button:hover {
      background-color: #b71c1c;
    }
  `]
})
export class ErrorExamplesComponent implements OnInit {
  private http = inject(HttpClient);
  private injector = inject(Injector);

  counter = 0;
  showTemplateError = false;
  showTypeError = false;
  showInfiniteLoop = false;
  showMissingInput = false;
  nullValue: any = null;
  undefinedObject: any;
  intervalCount = 0;

  ngOnInit() {
    // This can cause ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.counter = 1;
    });
  }

  // 1. Runtime TypeError
  triggerRuntimeError() {
    // This will cause a real runtime error that hits the global handler
    const obj: any = null;
    obj.someMethod(); // TypeError: Cannot read properties of null
  }

  // 2. Circular Dependency (real)
  triggerCircularDependency() {
    // This will trigger the actual circular dependency error
    // ServiceA injects ServiceB which injects ServiceA
    const serviceA = this.injector.get(ServiceA);
    serviceA.getData();
  }

  // 3. Missing Provider (real)
  useMissingService() {
    // This will cause a real NullInjectorError
    // MissingService is not provided anywhere
    const missingService = this.injector.get(MissingService);
    missingService.getData();
  }

  // 5. HTTP 404 Error
  trigger404Error() {
    this.http.get('/api/non-existent-endpoint').subscribe(value => {
      console.log(value);
    });
  }

  // 6. Type Error
  triggerTypeError() {
    this.showTypeError = true;
    // This will cause error when template tries to call toString() on null
  }

  // 7. Memory Leak
  createMemoryLeak() {
    // Creating interval without cleanup
    setInterval(() => {
      this.intervalCount++;
      console.log('Leaking memory...', this.intervalCount);
    }, 1000);
  }

  // 8. Problematic Getter (causes excessive change detection)
  get problematicGetter() {
    // This getter returns a new value each time, causing infinite change detection
    console.warn('Getter called - this causes performance issues!');
    return Math.random();
  }

  // 10. Reload to trigger lifecycle error
  reloadComponent() {
    // Simulating async error in lifecycle
    throw new Error('Error during component initialization!');
  }
}

// Child component for demonstrating missing input error
@Component({
  selector: 'app-child-with-required-input',
  standalone: true,
  template: '<p>Required data: {{ requiredData }}</p>'
})
export class ChildWithRequiredInputComponent {
  @Input({ required: true }) requiredData!: string;
}