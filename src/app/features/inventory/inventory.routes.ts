import { Routes } from '@angular/router';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { FournisseurFormComponent } from './components/fournisseur-form/fournisseur-form.component';
import { MatierePremiereListComponent } from './components/matiere-premiere-list/matiere-premiere-list.component';
import { MatierePremiereFormComponent } from './components/matiere-premiere-form/matiere-premiere-form.component';
import { CommandeFournisseurListComponent } from './components/commande-fournisseur-list/commande-fournisseur-list.component';
import { CommandeFournisseurFormComponent } from './components/commande-fournisseur-form/commande-fournisseur-form.component';

export const INVENTORY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'fournisseurs',
    pathMatch: 'full'
  },
  // Fournisseurs
  {
    path: 'fournisseurs',
    component: FournisseurListComponent
  },
  {
    path: 'fournisseurs/new',
    component: FournisseurFormComponent
  },
  {
    path: 'fournisseurs/:id',
    component: FournisseurFormComponent
  },
  {
    path: 'fournisseurs/:id/edit',
    component: FournisseurFormComponent
  },
  // Matières Premières
  {
    path: 'matieres-premieres',
    component: MatierePremiereListComponent
  },
  {
    path: 'matieres-premieres/new',
    component: MatierePremiereFormComponent
  },
  {
    path: 'matieres-premieres/:id',
    component: MatierePremiereFormComponent
  },
  {
    path: 'matieres-premieres/:id/edit',
    component: MatierePremiereFormComponent
  },
  // Commandes Fournisseurs
  {
    path: 'commandes-fournisseurs',
    component: CommandeFournisseurListComponent
  },
  {
    path: 'commandes-fournisseurs/create',
    component: CommandeFournisseurFormComponent
  },
  {
    path: 'commandes-fournisseurs/:id/edit',
    component: CommandeFournisseurFormComponent
  }
];
