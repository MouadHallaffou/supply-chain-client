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
    loadingCommande: boolean = false
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
            this.loadCommande(this.commandeId);
        }
    }

    initForm() {
        this.commandeForm = this.fb.group({
            fournisseurId: [null, Validators.required],
            orderDate: ['', Validators.required],
            status: ['EN_ATTENTE', Validators.required],
            commandeFournisseurMatieres: this.fb.array([])
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
            },
            error: (err) => {
                console.error('Erreur:', err);
                this.error = 'Erreur lors du chargement des matières premières.';
                this.matieres = [];
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
                // Redirection après 3 secondes si la commande n'existe pas
                setTimeout(() => {
                    this.router.navigate(['/inventory/commandes-fournisseurs']);
                }, 3000);
            }
        });
    }

    patchCommandeData(commande: any): void {
        // Convertir la date pour le champ datetime-local
        const orderDate = new Date(commande.orderDate);
        const formattedDate = orderDate.toISOString().slice(0, 16);

        // Mettre à jour les valeurs de base
        this.commandeForm.patchValue({
            fournisseurId: commande.fournisseurId,
            orderDate: formattedDate,
            status: commande.status
        });

        // Vider le FormArray existant
        const matieresArray = this.commandeFournisseurMatieres;
        while (matieresArray.length !== 0) {
            matieresArray.removeAt(0);
        }

        // Ajouter les matières de la commande
        if (commande.commandeFournisseurMatieres && commande.commandeFournisseurMatieres.length > 0) {
            commande.commandeFournisseurMatieres.forEach((matiere: any) => {
                this.addMatiereWithData(matiere.matierePremiereId, matiere.quantite);
            });
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
        const matiereGroup = this.fb.group({
            matierePremiereId: [matiereId, Validators.required],
            quantite: [quantite, [Validators.required, Validators.min(1)]]
        });
        this.commandeFournisseurMatieres.push(matiereGroup);
    }

    removeMatiere(index: number): void {
        this.commandeFournisseurMatieres.removeAt(index);
    }

    isFormValid(): boolean {
        // Vérifier les champs de base
        const fournisseurValid = this.commandeForm.get('fournisseurId')?.valid;
        const orderDateValid = this.commandeForm.get('orderDate')?.valid;

        if (!fournisseurValid || !orderDateValid) {
            return false;
        }

        // Vérifier qu'il y a au moins une matière
        if (this.commandeFournisseurMatieres.length === 0) {
            return false;
        }

        // Vérifier que chaque matière a une matière première sélectionnée
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

    // Méthode pour supprimer une commande
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
