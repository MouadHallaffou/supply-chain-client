import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  username = '';
  userProfile: any = null;
  isProfileMenuOpen = false;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.isLoggedIn = await this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.username = this.authService.getUsername();
      this.userProfile = await this.authService.getUserProfile();
    }
  }

  async login() {
    await this.authService.login();
  }

  async logout() {
    await this.authService.logout();
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu() {
    this.isProfileMenuOpen = false;
  }
}
