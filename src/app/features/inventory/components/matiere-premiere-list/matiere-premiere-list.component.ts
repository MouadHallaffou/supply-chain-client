import {Component, OnInit, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {MatierePremiereService} from '../../services/matiere-premiere.service';
import {MatierePremiereModel} from '../../models/matiere-premiere.model';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-matiere-premiere-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './matiere-premiere-list.component.html',
  styleUrl: './matiere-premiere-list.component.css'
})
export class MatierePremiereListComponent implements OnInit {
  private readonly matierePremiereService = inject(MatierePremiereService);
  private readonly router = inject(Router);

  matieresPremieres = signal<MatierePremiereModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  showDeleteModal = signal(false);
  selectedMatierePremiere = signal<MatierePremiereModel | null>(null);

  currentPage = signal(0);
  pageSize = 10;
  totalPages = signal(0);
  totalElements = signal(0);

  searchControl = new FormControl('');
  stockFilter = new FormControl<string>('all');

  ngOnInit(): void {
    this.loadMatieresPremieres();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.onSearch());
  }

  loadMatieresPremieres(): void {
    this.loading.set(true);
    this.error.set(null);

    const stockFilterValue = this.stockFilter.value;

    if (stockFilterValue === 'low') {
      // Filtrer par stock critique
      this.matierePremiereService.filterByStockCritique(150, this.currentPage(), this.pageSize)
        .subscribe({
          next: (response) => this.handleResponse(response),
          error: (err) => this.handleError(err)
        });
    } else {
      // Charger toutes les matières premières
      this.matierePremiereService.getAll(this.currentPage(), this.pageSize)
        .subscribe({
          next: (response) => this.handleResponse(response),
          error: (err) => this.handleError(err)
        });
    }
  }

  private handleResponse(response: any): void {
    this.matieresPremieres.set(response.content || []);
    this.totalPages.set(response.totalPages || 0);
    this.totalElements.set(response.totalElements || 0);
    this.loading.set(false);
  }

  private handleError(err: any): void {
    this.error.set('Erreur lors du chargement des données');
    console.error('Erreur:', err);
    this.loading.set(false);
  }

  onSearch(): void {
    const searchTerm = this.searchControl.value?.trim().toLowerCase();
    if (!searchTerm) {
      this.loadMatieresPremieres();
      return;
    }

    const filtered = this.matieresPremieres().filter(m =>
      m.name.toLowerCase().includes(searchTerm)
    );
    this.matieresPremieres.set(filtered);
  }

  onFilterChange(): void {
    this.currentPage.set(0);
    this.loadMatieresPremieres();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.stockFilter.setValue('all');
    this.currentPage.set(0);
    this.loadMatieresPremieres();
  }

  onAdd(): void {
    this.router.navigate(['/inventory/matieres-premieres/new']);
  }

  onView(matierePremiere: MatierePremiereModel): void {
    this.router.navigate(['/inventory/matieres-premieres', matierePremiere.matierePremiereId]);
  }

  onEdit(matierePremiere: MatierePremiereModel): void {
    this.router.navigate(['/inventory/matieres-premieres', matierePremiere.matierePremiereId, 'edit']);
  }

  onDelete(matierePremiere: MatierePremiereModel): void {
    this.selectedMatierePremiere.set(matierePremiere);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedMatierePremiere.set(null);
  }

  confirmDelete(): void {
    const matierePremiere = this.selectedMatierePremiere();
    if (!matierePremiere?.matierePremiereId) return;

    this.loading.set(true);
    this.matierePremiereService.delete(matierePremiere.matierePremiereId).subscribe({
      next: () => {
        this.success.set(`"${matierePremiere.name}" supprimée avec succès`);
        this.closeDeleteModal();
        this.loadMatieresPremieres();
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

  isStockLow(matierePremiere: MatierePremiereModel): boolean {
    return matierePremiere.stockQuantity <= matierePremiere.stockMinimum;
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadMatieresPremieres();
    }
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 5) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {
      if (current < 2) {
        pages.push(0, 1, 2, 3, 4);
      } else if (current > total - 3) {
        for (let i = total - 5; i < total; i++) pages.push(i);
      } else {
        for (let i = current - 2; i <= current + 2; i++) pages.push(i);
      }
    }

    return pages;
  }
}
