import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { TrackJS } from "trackjs";

TrackJS.install({
  token: "angular-example"
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
