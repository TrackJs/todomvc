import { Injectable } from '@angular/core';

// This service is NOT provided anywhere - will cause NullInjectorError
@Injectable()
export class MissingService {
  getData() {
    return 'This service is not provided!';
  }
}