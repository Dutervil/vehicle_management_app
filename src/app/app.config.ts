import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';


import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideToastr} from "ngx-toastr";
import {provideAnimations} from "@angular/platform-browser/animations";
import {AuthInterceptor} from "./admin/interceptors/auth.interceptor";



export const appConfig: ApplicationConfig = {

  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(

    ),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, // Provide the class-based interceptor here
      multi: true, // Allows multiple interceptors
    },

    provideToastr(),

  ],

};
