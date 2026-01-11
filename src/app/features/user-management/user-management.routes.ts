import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleFormComponent } from './components/role-form/role-form.component';

export const USER_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'users/create',
    component: UserFormComponent
  },
  {
    path: 'users/:id/edit',
    component: UserFormComponent
  },
  {
    path: 'roles',
    component: RoleListComponent
  },
  {
    path: 'roles/create',
    component: RoleFormComponent
  },
  {
    path: 'roles/:id/edit',
    component: RoleFormComponent
  }
];
