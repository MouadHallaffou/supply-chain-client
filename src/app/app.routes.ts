import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './core/components/unauthorized/unauthorized.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'user-management',
        loadChildren: () => import('./features/user-management/user-management.routes')
          .then(m => m.USER_MANAGEMENT_ROUTES),
        canActivate: [AuthGuard],
        data: { roles: ['admin', 'ADMIN'] }
      },
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventory/inventory.routes')
          .then(m => m.INVENTORY_ROUTES),
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./features/production/production.routes')
          .then(m => m.PRODUCTION_ROUTES),
        canActivate: [AuthGuard]
      },
      {
        path: 'delivery',
        loadChildren: () => import('./features/delivery/delivery.routes')
          .then(m => m.DELIVERY_ROUTES),
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
