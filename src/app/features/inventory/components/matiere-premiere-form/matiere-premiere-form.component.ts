import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatierePremiereService } from '../../services/matiere-premiere.service';
import { FournisseurService } from '../../services/fournisseur.service';
import { MatierePremiereCreateDto, MatierePremiereUpdateDto } from '../../models/matiere-premiere';
import { Fournisseur } from '../../models/fournisseur';

@Component({
  selector: 'app-matiere-premiere-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './matiere-premiere-form.component.html',
  styleUrl: './matiere-premiere-form.component.css'
})
export class MatierePremiereFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly matierePremiereService = inject(MatierePremiereService);
  private readonly fournisseurService = inject(FournisseurService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  isEditMode = signal(false);
  matierePremiereId = signal<number | null>(null);
  fournisseurs = signal<Fournisseur[]>([]);

  matierePremiereForm!: FormGroup;

  get name() { return this.matierePremiereForm.get('name')!; }
  get stockMinimum() { return this.matierePremiereForm.get('stockMinimum')!; }
  get stockQuantity() { return this.matierePremiereForm.get('stockQuantity')!; }
  get unit() { return this.matierePremiereForm.get('unit')!; }
  get fournisseurIds() { return this.matierePremiereForm.get('fournisseurIds')!; }

  ngOnInit(): void {
    this.initForm();
    this.loadFournisseurs();
    this.checkEditMode();
  }

  private initForm(): void {
    this.matierePremiereForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      stockMinimum: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      unit: ['', [Validators.required, Validators.maxLength(20)]],
      fournisseurIds: [[]]
    });
  }

  private loadFournisseurs(): void {
    this.fournisseurService.getAll().subscribe({
      next: (data) => {
        this.fournisseurs.set(data.filter(f => f.isActive));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des fournisseurs:', err);
      }
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.matierePremiereId.set(parseInt(id));
      this.loadMatierePremiere(parseInt(id));
    }
  }

  private loadMatierePremiere(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.matierePremiereService.getById(id).subscribe({
      next: (data) => {
        this.matierePremiereForm.patchValue(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement de la matière première');
        console.error('Erreur:', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.matierePremiereForm.invalid) {
      this.markFormGroupTouched(this.matierePremiereForm);
      this.error.set('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.matierePremiereForm.value;

    if (this.isEditMode() && this.matierePremiereId()) {

      const updateDto: MatierePremiereUpdateDto = formValue;
      this.matierePremiereService.update(this.matierePremiereId()!, updateDto).subscribe({
        next: () => {
          this.success.set('Matière première modifiée avec succès');
          this.loading.set(false);
          setTimeout(() => {
            this.router.navigate(['/inventory/matieres-premieres']);
          }, 1500);
        },
        error: (err) => {
          this.error.set('Erreur lors de la modification de la matière première');
          console.error('Erreur:', err);
          this.loading.set(false);
        }
      });
    } else {

      const createDto: MatierePremiereCreateDto = formValue;
      this.matierePremiereService.create(createDto).subscribe({
        next: () => {
          this.success.set('Matière première créée avec succès');
          this.loading.set(false);
          setTimeout(() => {
            this.router.navigate(['/inventory/matieres-premieres']);
          }, 1500);
        },
        error: (err) => {
          this.error.set('Erreur lors de la création de la matière première');
          console.error('Erreur:', err);
          this.loading.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/inventory/matieres-premieres']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onFournisseurChange(event: Event, fournisseurId: number): void {
    const checkbox = event.target as HTMLInputElement;
    const currentIds = this.fournisseurIds.value || [];

    if (checkbox.checked) {
      this.fournisseurIds.setValue([...currentIds, fournisseurId]);
    } else {
      this.fournisseurIds.setValue(currentIds.filter((id: number) => id !== fournisseurId));
    }
  }

  isFournisseurSelected(fournisseurId: number): boolean {
    const currentIds = this.fournisseurIds.value || [];
    return currentIds.includes(fournisseurId);
  }
}
