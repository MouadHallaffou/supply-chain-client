import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FournisseurService } from '../../services/fournisseur.service';
import { FournisseurCreateDto, FournisseurUpdateDto } from '../../models/fournisseur';

@Component({
  selector: 'app-fournisseur-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fournisseur-form.component.html',
  styleUrl: './fournisseur-form.component.css'
})
export class FournisseurFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly fournisseurService = inject(FournisseurService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  isEditMode = signal(false);
  fournisseurId = signal<number | null>(null);

  fournisseurForm!: FormGroup;

  get name() { return this.fournisseurForm.get('name')!; }
  get contactEmail() { return this.fournisseurForm.get('contactEmail')!; }
  get phoneNumber() { return this.fournisseurForm.get('phoneNumber')!; }
  get address() { return this.fournisseurForm.get('address')!; }
  get leadTimeDays() { return this.fournisseurForm.get('leadTimeDays')!; }
  get rating() { return this.fournisseurForm.get('rating')!; }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.fournisseurForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      isActive: [true],
      leadTimeDays: [0, [Validators.required, Validators.min(0), Validators.max(365)]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.fournisseurId.set(parseInt(id));
      this.loadFournisseur(parseInt(id));
    }
  }

  private loadFournisseur(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.fournisseurService.getById(id).subscribe({
      next: (data) => {
        this.fournisseurForm.patchValue(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du fournisseur');
        console.error('Erreur:', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.fournisseurForm.invalid) {
      this.markFormGroupTouched(this.fournisseurForm);
      this.error.set('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formValue = this.fournisseurForm.value;

    if (this.isEditMode() && this.fournisseurId()) {
      // Mode édition
      const updateDto: FournisseurUpdateDto = formValue;
      this.fournisseurService.update(this.fournisseurId()!, updateDto).subscribe({
        next: (data) => {
          this.success.set('Fournisseur modifié avec succès');
          this.loading.set(false);
          setTimeout(() => {
            this.router.navigate(['/inventory/fournisseurs']);
          }, 1500);
        },
        error: (err) => {
          this.error.set('Erreur lors de la modification du fournisseur');
          console.error('Erreur:', err);
          this.loading.set(false);
        }
      });
    } else {
      // Mode création
      const createDto: FournisseurCreateDto = formValue;
      this.fournisseurService.create(createDto).subscribe({
        next: (data) => {
          this.success.set('Fournisseur créé avec succès');
          this.loading.set(false);
          setTimeout(() => {
            this.router.navigate(['/inventory/fournisseurs']);
          }, 1500);
        },
        error: (err) => {
          this.error.set('Erreur lors de la création du fournisseur');
          console.error('Erreur:', err);
          this.loading.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/inventory/fournisseurs']);
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

}
