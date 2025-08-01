import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServiceA {
  private serviceB = inject(ServiceB);

  getData() {
    return 'ServiceA needs: ' + this.serviceB.getData();
  }
}

@Injectable({ providedIn: 'root' })
export class ServiceB {
  private serviceA = inject(ServiceA); // This creates circular dependency

  getData(): any {
    return 'ServiceB needs: ' + this.serviceA.getData();
  }
}