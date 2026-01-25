import { Routes } from '@angular/router';
import {ClientListComponent} from './components/client-list/client-list.component';
import {AuthGuard} from '../../core/guards/auth.guard';

export const clientRoutes: Routes = [
  {
    path: 'clients',
    component: ClientListComponent,
    canActivate: [AuthGuard]
  }
];
