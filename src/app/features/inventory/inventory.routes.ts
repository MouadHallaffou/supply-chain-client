import { Routes } from '@angular/router';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { FournisseurFormComponent } from './components/fournisseur-form/fournisseur-form.component';
import { MatierePremiereListComponent } from './components/matiere-premiere-list/matiere-premiere-list.component';
import { MatierePremiereFormComponent } from './components/matiere-premiere-form/matiere-premiere-form.component';
import { CommandeFournisseurListComponent } from './components/commande-fournisseur-list/commande-fournisseur-list.component';
import { CommandeFournisseurFormComponent } from './components/commande-fournisseur-form/commande-fournisseur-form.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'fournisseurs',
    pathMatch: 'full'
  },
  // Fournisseurs
  {
    path: 'fournisseurs',
    component: FournisseurListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fournisseurs/new',
    component: FournisseurFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fournisseurs/:id/edit',
    component: FournisseurFormComponent,
    canActivate: [AuthGuard]
  },
  // Matières Premières
  {
    path: 'matieres-premieres',
    component: MatierePremiereListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'matieres-premieres/new',
    component: MatierePremiereFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'matieres-premieres/:id/edit',
    component: MatierePremiereFormComponent,
    canActivate: [AuthGuard]
  },
  // Commandes Fournisseurs
  {
    path: 'commandes-fournisseurs',
    component: CommandeFournisseurListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'commandes-fournisseurs/create',
    component: CommandeFournisseurFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'commandes-fournisseurs/:id/edit',
    component: CommandeFournisseurFormComponent,
    canActivate: [AuthGuard]
  }
];
