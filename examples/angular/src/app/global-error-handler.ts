import { ErrorHandler, Injectable } from '@angular/core';
import { TrackJS } from "trackjs";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {
    TrackJS.track(error);
    console.warn(error);
  }
}