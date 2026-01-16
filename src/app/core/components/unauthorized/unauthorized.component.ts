import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-header bg-danger text-white">
              <h3 class="mb-0">
                <i class="bi bi-shield-exclamation me-2"></i>
                Access Denied
              </h3>
            </div>
            <div class="card-body text-center">
              <i class="bi bi-lock display-1 text-danger mb-3"></i>
              <h4 class="card-title mb-3">Unauthorized Access</h4>
              <p class="card-text">
                You don't have permission to access this page.
                Please contact your administrator if you think this is an error.
              </p>
              <a routerLink="/dashboard" class="btn btn-primary">
                <i class="bi bi-house me-1"></i>
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UnauthorizedComponent {}
