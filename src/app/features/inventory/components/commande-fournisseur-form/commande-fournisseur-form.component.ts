import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommandeFournisseurService } from '../../services/commande-fournisseur.service';
import { FournisseurService } from '../../services/fournisseur.service';
import { MatierePremiereService } from '../../services/matiere-premiere.service';
import { FournisseurModel } from '../../models/fournisseur.model';
import { MatierePremiereModel } from '../../models/matiere-premiere.model';

@Component({
  selector: 'app-commande-fournisseur-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './commande-fournisseur-form.component.html',
  styleUrl: './commande-fournisseur-form.component.css'
})
export class CommandeFournisseurFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly commandeService = inject(CommandeFournisseurService)
  private readonly fournisseurService = inject(FournisseurService)
  private readonly matiereService = inject(MatierePremiereService)

  private destroy$ = new Subject<void>();

  commandeForm!: FormGroup
  fournisseurs: FournisseurModel[] = []
  // matieres: MatierePremiereModel[] = []
  filteredMatieres: MatierePremiereModel[] = []
  selectedFournisseurId: number | null = null
  loading: boolean = false
  loadingCommande: boolean = false
  error: string | null = null
  isEditMode: boolean = false
  commandeId: number | null = null

  ngOnInit(): void {
    this.initForm();
    this.loadFournisseurs();
    this.setupFormListeners();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.commandeId = +id;
      this.loadCommande(this.commandeId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.commandeForm = this.fb.group({
      fournisseurId: [null, Validators.required],
      orderDate: ['', Validators.required],
      status: ['EN_ATTENTE', Validators.required],
      commandeFournisseurMatieres: this.fb.array([])
    });
  }

  setupFormListeners() {
    this.commandeForm.get('fournisseurId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((fournisseurId: number | null) => {
        this.selectedFournisseurId = fournisseurId;
        this.onFournisseurChange(fournisseurId);
      });
  }

  loadFournisseurs() {
    this.fournisseurService.getAll().subscribe({
      next: (data) => {
        this.fournisseurs = data;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = 'Erreur lors du chargement des fournisseurs.';
      }
    });
  }

  onFournisseurChange(fournisseurId: number | null) {
    if (fournisseurId) {
      this.loadMatieresByFournisseur(fournisseurId);
    } else {
      this.filteredMatieres = [];
    }

    if (this.selectedFournisseurId !== fournisseurId) {
      this.clearMatieresArray();
    }
  }

  loadMatieresByFournisseur(fournisseurId: number) {
    this.loading = true;
    this.matiereService.getByFournisseurId(fournisseurId).subscribe({
      next: (matieres: MatierePremiereModel[]) => {
        this.filteredMatieres = matieres;
        this.loading = false;
        console.log(`Matières chargées pour le fournisseur ${fournisseurId}:`, matieres.length);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.filteredMatieres = [];
        this.loading = false;
        this.error = 'Erreur lors du chargement des matières du fournisseur.';
      }
    });
  }

  loadCommande(id: number): void {
    this.loadingCommande = true;
    this.commandeService.getById(id).subscribe({
      next: (commande) => {
        this.patchCommandeData(commande);
        this.loadingCommande = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la commande:', err);
        this.error = 'Erreur lors du chargement de la commande.';
        this.loadingCommande = false;
        setTimeout(() => {
          this.router.navigate(['/inventory/commandes-fournisseurs']);
        }, 3000);
      }
    });
  }

  patchCommandeData(commande: any): void {
    const orderDate = new Date(commande.orderDate);
    const formattedDate = orderDate.toISOString().slice(0, 16);

    this.commandeForm.patchValue({
      fournisseurId: commande.fournisseurId,
      orderDate: formattedDate,
      status: commande.status
    });

    if (commande.fournisseurId) {
      this.loadMatieresByFournisseur(commande.fournisseurId);
    }

    this.clearMatieresArray();

    if (commande.commandeFournisseurMatieres && commande.commandeFournisseurMatieres.length > 0) {
      setTimeout(() => {
        commande.commandeFournisseurMatieres.forEach((matiere: any) => {
          this.addMatiereWithData(matiere.matierePremiereId, matiere.quantite);
        });
      }, 500);
    }
  }

  clearMatieresArray() {
    const matieresArray = this.commandeFournisseurMatieres;
    while (matieresArray.length !== 0) {
      matieresArray.removeAt(0);
    }
  }

  get commandeFournisseurMatieres(): FormArray {
    return this.commandeForm.get('commandeFournisseurMatieres') as FormArray;
  }

  addMatiere(): void {
    const matiereGroup = this.fb.group({
      matierePremiereId: [null, Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]]
    });
    this.commandeFournisseurMatieres.push(matiereGroup);
  }

  addMatiereWithData(matiereId: number, quantite: number): void {
    const matiereExists = this.filteredMatieres.some(m => m.matierePremiereId === matiereId);

    if (matiereExists) {
      const matiereGroup = this.fb.group({
        matierePremiereId: [matiereId, Validators.required],
        quantite: [quantite, [Validators.required, Validators.min(1)]]
      });
      this.commandeFournisseurMatieres.push(matiereGroup);
    } else {
      console.warn(`La matière ${matiereId} n'appartient pas au fournisseur sélectionné`);
    }
  }

  removeMatiere(index: number): void {
    this.commandeFournisseurMatieres.removeAt(index);
  }

  isFormValid(): boolean {
    const fournisseurValid = this.commandeForm.get('fournisseurId')?.valid;
    const orderDateValid = this.commandeForm.get('orderDate')?.valid;

    if (!fournisseurValid || !orderDateValid) {
      return false;
    }

    if (this.commandeFournisseurMatieres.length === 0) {
      return false;
    }

    for (let i = 0; i < this.commandeFournisseurMatieres.length; i++) {
      const matiereGroup = this.commandeFournisseurMatieres.at(i) as FormGroup;
      const matiereId = matiereGroup.get('matierePremiereId')?.value;
      const quantite = matiereGroup.get('quantite')?.value;
      const quantiteValid = matiereGroup.get('quantite')?.valid;

      if (!matiereId || !quantite || !quantiteValid) {
        return false;
      }
    }

    return true;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      console.log('Formulaire invalide');
      return;
    }

    const formValue = this.commandeForm.value;

    // Formatter les données
    const commandeData = {
      ...formValue,
      orderDate: new Date(formValue.orderDate).toISOString()
    };

    this.loading = true;

    if (this.isEditMode && this.commandeId) {
      // Mode édition
      this.commandeService.update(this.commandeId, commandeData).subscribe({
        next: (data) => {
          this.loading = false;
          this.router.navigate(['/inventory/commandes-fournisseurs']);
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.error = 'Erreur lors de la mise à jour de la commande fournisseur.';
          this.loading = false;
        }
      });
    } else {
      // Mode création
      this.commandeService.create(commandeData).subscribe({
        next: (data) => {
          this.loading = false;
          this.router.navigate(['/inventory/commandes-fournisseurs']);
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.error = 'Erreur lors de la création de la commande fournisseur.';
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/inventory/commandes-fournisseurs']);
  }

  deleteCommande() {
    if (this.commandeId && confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.loading = true;
      this.commandeService.delete(this.commandeId).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/inventory/commandes-fournisseurs']);
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.error = 'Erreur lors de la suppression de la commande.';
          this.loading = false;
        }
      });
    }
  }

}
