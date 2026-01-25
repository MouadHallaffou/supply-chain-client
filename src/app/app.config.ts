import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { KeycloakInitService } from './core/services/keycloak-init.service';
import { addressReducer } from './features/delivery/store/address/address.reducer';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AddressEffects } from './features/delivery/store/address/address.effects';
import { clientReducer } from './features/delivery/store/client/client.reducer';
import { ClientEffects } from './features/delivery/store/client/client.effects';
import { clientOrderReducer } from './features/delivery/store/client-order/client-order.reducer';
import { ClientOrderEffects } from './features/delivery/store/client-order/client-order.effects';

function initializeKeycloak(keycloakInitService: KeycloakInitService) {
  return () => keycloakInitService.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    importProvidersFrom(KeycloakAngularModule),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakInitService]
    },
    provideStore({
      address: addressReducer,
      clients: clientReducer,
      clientOrder: clientOrderReducer
    }),
    provideEffects([AddressEffects, ClientEffects, ClientOrderEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: true
    })
  ]
};


