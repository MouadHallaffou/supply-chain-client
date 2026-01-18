import {Routes} from '@angular/router';
import {ProductListComponent} from './components/product-list/product-list.component';
import {AuthGuard} from '../../core/guards/auth.guard';
import {ProductFormComponent} from './components/product-form/product-form.component';

export const PRODUCTION_ROUTES: Routes = [
  {
    path: '',
    component: ProductListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new',
    component: ProductFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuard]
  }
];
