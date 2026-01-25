import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FournisseurService } from '../../services/fournisseur.service';
import { FournisseurModel } from '../../models/fournisseur.model';

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fournisseur-list.component.html',
  styleUrl: './fournisseur-list.component.css'
})
export class FournisseurListComponent implements OnInit {
  private readonly fournisseurService = inject(FournisseurService);
  private readonly router = inject(Router);

  fournisseurs = signal<FournisseurModel[]>([]);
  allFournisseurs = signal<FournisseurModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  showDeleteModal = signal(false);
  selectedFournisseur = signal<FournisseurModel | null>(null);

  totalItems = signal(0);

  searchControl = new FormControl('');
  statusFilter = new FormControl<boolean | null>(null);
  sortControl = new FormControl('name');

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.loading.set(true);
    this.error.set(null);

    this.fournisseurService.getAll().subscribe({
      next: (data) => {
        this.allFournisseurs.set(data);
        this.fournisseurs.set(data);
        this.totalItems.set(data.length);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des fournisseurs');
        console.error('Erreur:', err);
        this.loading.set(false);
      }
    });
  }

  onSortChange(): void {
    const sortBy = this.sortControl.value;
    const sorted = [...this.fournisseurs()];

    sorted.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'leadTimeDays') {
        return a.leadTimeDays - b.leadTimeDays;
      }
      return 0;
    });

    this.fournisseurs.set(sorted);
  }

  onAdd(): void {
    this.router.navigate(['/inventory/fournisseurs/new']);
  }

  onView(fournisseur: FournisseurModel): void {
    this.router.navigate(['/inventory/fournisseurs', fournisseur.fournisseurId]);
  }

  onEdit(fournisseur: FournisseurModel): void {
    this.router.navigate(['/inventory/fournisseurs', fournisseur.fournisseurId, 'edit']);
  }

  onDelete(fournisseur: FournisseurModel): void {
    this.selectedFournisseur.set(fournisseur);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedFournisseur.set(null);
  }

  confirmDelete(): void {
    const fournisseur = this.selectedFournisseur();
    if (fournisseur && fournisseur.fournisseurId) {
      this.loading.set(true);
      this.fournisseurService.delete(fournisseur.fournisseurId).subscribe({
        next: () => {
          this.success.set(`Fournisseur "${fournisseur.name}" supprimé avec succès`);
          this.closeDeleteModal();
          this.loadFournisseurs();

          setTimeout(() => this.success.set(null), 3000);
        },
        error: (err) => {
          this.error.set('Erreur lors de la suppression');
          console.error('Erreur:', err);
          this.loading.set(false);
          this.closeDeleteModal();
        }
      });
    }
  }

}
