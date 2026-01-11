import { Routes } from '@angular/router';
import {AppComponent} from './app.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user-management',
    pathMatch: 'full'
  },
  {
    path: 'user-management',
    loadChildren: () => import('./features/user-management/user-management.routes').then(m => m.USER_MANAGEMENT_ROUTES)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES)
  }
];
