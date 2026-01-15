import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CommandeFournisseurService} from '../../services/commande-fournisseur.service';
import {FournisseurService} from '../../services/fournisseur.service';
import {MatierePremiereService} from '../../services/matiere-premiere.service';
import {Fournisseur} from '../../models/fournisseur';
import {MatierePremiere} from '../../models/matiere-premiere';

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
export class CommandeFournisseurFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly commandeService = inject(CommandeFournisseurService)
  private readonly fournisseurService = inject(FournisseurService)
  private readonly matiereService = inject(MatierePremiereService)

  commandeForm!: FormGroup
  fournisseurs: Fournisseur[] = []
  matieres: MatierePremiere[] = []
  loading: boolean = false
  error: string | null = null
  isEditMode: boolean = false
  commandeId: number | null = null

  ngOnInit(): void {
    this.initForm();
    this.loadFournisseurs();
    this.loadMatieres();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.commandeId = +id;
    }
  }

  initForm() {
    this.commandeForm = this.fb.group({
      fournisseurId: [null, Validators.required],
      orderDate: ['', Validators.required],
      status: ['EN_ATTENTE', Validators.required],
      commandeFournisseurMatieres: this.fb.array([], Validators.minLength(1)),
    });
  }

  loadFournisseurs() {
    this.fournisseurService.getAll().subscribe({
      next: (data) => this.fournisseurs = data,
      error: (err) => this.error = 'Erreur lors du chargement des fournisseurs.'
    });
  }

  loadMatieres() {
    this.matiereService.getAll(0, 100).subscribe({
      next: (response) => {
        this.matieres = Array.isArray(response) ? response : (response.content || []);
        console.log('Matières chargées:', this.matieres);
        console.log('Nombre de matières:', this.matieres.length);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = 'Erreur lors du chargement des matières premières.';
        this.matieres = [];
      }
    });
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

  removeMatiere(index: number): void {
    this.commandeFournisseurMatieres.removeAt(index);
  }

  onSubmit() {
    if (this.commandeForm.invalid) {
      return;
    }
    const formValue = this.commandeForm.value;
    const commandeData = {
      ...formValue,
      orderDate: new Date(formValue.orderDate).toISOString()
    };
    this.loading = true;
    this.commandeService.create(commandeData).subscribe({
      next: (data) => {
        this.loading = false;
        this.router.navigate(['/inventory/commandes-fournisseurs']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création de la commande fournisseur.';
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/inventory/commandes-fournisseurs']);
  }


}
