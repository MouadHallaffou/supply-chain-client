import { Routes } from '@angular/router';

// Components
import { AddressListComponent } from './components/address-list/address-list.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import {ClientOrderListComponent} from './components/client-order-list/client-order-list.component';
import {AuthGuard} from '../../core/guards/auth.guard';
import {ClientOrderFormComponent} from './components/client-order-form/client-order-form.component';

export const DELIVERY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'addresses',
    pathMatch: 'full'
  },
  {
    path: 'addresses',
    component: AddressListComponent
  },
  {
    path: 'addresses/create',
    component: AddressFormComponent
  },
  {
    path: 'addresses/:id/edit',
    component: AddressFormComponent
  },
  {
    path: 'clients',
    component: ClientListComponent
  },
  {
    path: 'client-orders',
    component: ClientOrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'client-orders/new',
    component: ClientOrderFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'client-orders/:id',
    component: ClientOrderFormComponent,
    canActivate: [AuthGuard]
  }

];

