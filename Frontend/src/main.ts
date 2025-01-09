import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideAnimationsAsync(),MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }]
}).catch((err) => console.error(err));

