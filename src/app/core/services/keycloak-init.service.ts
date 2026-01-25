import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakOptions } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KeycloakInitService {

  constructor(private keycloakService: KeycloakService) {}

  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing Keycloak...');
      console.log('Keycloak URL:', environment.keycloak.url);
      console.log('Realm:', environment.keycloak.realm);
      console.log('Client ID:', environment.keycloak.clientId);

      const initOptions: KeycloakOptions = {
        config: {
          url: environment.keycloak.url,
          realm: environment.keycloak.realm,
          clientId: environment.keycloak.clientId
        },
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false,
          pkceMethod: 'S256',
          redirectUri: window.location.origin
        },
        loadUserProfileAtStartUp: true,
        enableBearerInterceptor: true,
        bearerPrefix: 'Bearer',
        bearerExcludedUrls: ['/assets', 'clients/public']
      };

      console.log('Keycloak init options:', initOptions);

      const authenticated = await this.keycloakService.init(initOptions);

      console.log('Keycloak initialized successfully. Authenticated:', authenticated);

      if (authenticated) {
        const userRoles = this.keycloakService.getUserRoles();
        const username = this.keycloakService.getUsername();
        console.log('UserModel roles:', userRoles);
        console.log('Username:', username);
        console.log('Token:', await this.keycloakService.getToken());
      }

      return authenticated;
    } catch (error) {
      console.error('Failed to initialize Keycloak', error);
      throw error;
    }
  }
}
