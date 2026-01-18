import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userProfile: KeycloakProfile | null = null;

  constructor(private keycloakService: KeycloakService) {}


  async login(): Promise<void> {
    await this.keycloakService.login({
      redirectUri: window.location.origin
    });
  }

  async logout(): Promise<void> {
    await this.keycloakService.logout(window.location.origin);
  }

  isLoggedIn(): Promise<boolean> {
    return this.keycloakService.isLoggedIn();
  }

  async getUserProfile(): Promise<KeycloakProfile | null> {
    if (!this.userProfile) {
      try {
        if (await this.isLoggedIn()) {
          this.userProfile = await this.keycloakService.loadUserProfile();
        }
      } catch (error) {
        console.error('Failed to load user profile', error);
      }
    }
    return this.userProfile;
  }

  getUsername(): string {
    return this.keycloakService.getUsername();
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    return this.keycloakService.getUserRoles().includes(role);
  }

}
