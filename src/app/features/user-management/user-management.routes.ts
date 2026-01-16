import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const USER_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'ADMIN'] }
  },
  {
    path: 'users/create',
    component: UserFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'ADMIN'] }
  },
  {
    path: 'users/:id/edit',
    component: UserFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'ADMIN'] }
  },
  {
    path: 'roles',
    component: RoleListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'ADMIN'] }
  },
  {
    path: 'roles/create',
    component: RoleFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'ADMIN'] }
  },
  {
    path: 'roles/:id/edit',
    component: RoleFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'ADMIN'] }
  }
];
