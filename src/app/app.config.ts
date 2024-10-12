import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideClientHydration(), provideHttpClient(),provideLottieOptions({ player: () =>  import('lottie-web'), }),
    provideCacheableAnimationLoader(),]
};
