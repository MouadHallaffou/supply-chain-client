export interface CommandeFournisseurModel {
  commandeFournisseurId: number;
  fournisseurId: number;
  orderDate: string;
  status: 'EN_ATTENTE' | 'EN_COURS' | 'RECUE' | 'ANNULEE';
  commandeFournisseurMatieres: CommandeFournisseurMatiere[];
}

export interface CommandeFournisseurMatiere {
  matierePremiereId: number;
  quantite: number;
}

export interface CommandeFournisseurCreateDto {
  fournisseurId: number;
  orderDate: string;
  status: 'EN_ATTENTE' | 'EN_COURS' | 'RECUE' | 'ANNULEE';
  commandeFournisseurMatieres: CommandeFournisseurMatiere[];
}

export interface CommandeFournisseurUpdateDto {
  fournisseurId: number;
  orderDate: string;
  status: 'EN_ATTENTE' | 'EN_COURS' | 'RECUE' | 'ANNULEE';
  commandeFournisseurMatieres: CommandeFournisseurMatiere[];
}
