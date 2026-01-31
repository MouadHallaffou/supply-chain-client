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

import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from '../environments/environment';

function initializeKeycloak(keycloakInitService: KeycloakInitService) {
  return () => keycloakInitService.initialize();
}

// Fonction factory pour Apollo
export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({
      uri: environment.graphUrl,
      // headers d'authentification 
      // headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }),
    cache: new InMemoryCache({
      typePolicies: {
        // Configuration pour le cache
        Query: {
          fields: {
            getAllClients: {
              merge(existing, incoming) {
                return incoming;
              },
            },
            getAllAddresses: {
              merge(existing, incoming) {
                return incoming;
              },
            },
            getAllClientOrders: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  };
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
    
    // Configuration Apollo
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
    
    importProvidersFrom(
      KeycloakAngularModule,
      ApolloModule
    ),
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