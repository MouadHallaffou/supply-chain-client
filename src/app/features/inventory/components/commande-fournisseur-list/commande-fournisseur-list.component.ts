import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from '@angular/router';
import {CommandeFournisseurService} from '../../services/commande-fournisseur.service';

@Component({
  selector: 'app-commande-fournisseur-list',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './commande-fournisseur-list.component.html',
  styleUrl: './commande-fournisseur-list.component.css'
})
export class CommandeFournisseurListComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly commandeFournisseurService = inject(CommandeFournisseurService);

  commandes: any[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  loading: boolean = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes() {
    this.loading = true;
    this.commandeFournisseurService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        // Vérifier si la réponse contient les propriétés attendues
        if (response && typeof response === 'object') {
          this.commandes = response.content || [];
          this.totalPages = response.totalPages || 0;
          this.currentPage = response.number || 0;
        } else {
          this.commandes = [];
          this.totalPages = 0;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des commandes.';
        this.commandes = [];
        this.totalPages = 0;
        this.loading = false;
      }
    });
    // console.log(this.commandes);
  }

  onReset(): void {
    this.currentPage = 0;
    this.pageSize = 10;
    this.loadCommandes();
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'RECUE': 'Reçue',
      'ANNULEE': 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'EN_ATTENTE': 'bg-warning text-dark',
      'EN_COURS': 'bg-info text-white',
      'RECUE': 'bg-success text-white',
      'ANNULEE': 'bg-danger text-white'
    };
    return classes[status] || 'bg-secondary text-white';
  }

  onAdd(): void {
    this.router.navigate(['/inventory/commandes-fournisseurs/create']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/inventory/commandes-fournisseurs', id, 'edit']);
  }

  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeFournisseurService.delete(id).subscribe({
        next: () => {
          this.loadCommandes();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('fr-FR');
  }

  onStartProcessing(id: number): void {
    this.commandeFournisseurService.startProcessing(id).subscribe({
      next: () => {
        this.loadCommandes();
      },
      error: (err) => {
        this.error = 'Erreur lors du démarrage du traitement';
        console.error(err);
      }
    });
  }

  onCompleteOrder(id: number): void {
    this.commandeFournisseurService.completeProcessing(id).subscribe({
      next: () => {
        this.loadCommandes();
      },
      error: (err) => {
        this.error = 'Erreur lors de la complétion de la commande';
        console.error(err);
      }
    });
  }

  onCancelOrder (id: number): void {
    this.commandeFournisseurService.cancelOrder(id).subscribe({
      next: () => {
        this.loadCommandes();
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'annulation de la commande';
        console.error(err);
      }
    });
  }

}
