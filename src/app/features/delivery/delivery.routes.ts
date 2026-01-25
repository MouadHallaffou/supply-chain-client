import { Routes } from '@angular/router';

// Components
import { AddressListComponent } from './components/address-list/address-list.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { ClientListComponent } from './components/client-list/client-list.component';

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
  }
];

