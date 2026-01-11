import { Routes } from '@angular/router';
import { MatierePremiereListComponent } from './components/matiere-premiere-list/matiere-premiere-list.component';

export let INVENTORY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'items',
    pathMatch: 'full'
  },
  {
    path: 'items',
    loadComponent: () => import('./components/matiere-premiere-list/matiere-premiere-list.component').then(m => m.MatierePremiereListComponent)
  }

];
