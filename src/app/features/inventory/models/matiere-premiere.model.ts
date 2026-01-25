export interface MatierePremiereModel {
  matierePremiereId?: number;
  name: string;
  stockMinimum: number;
  stockQuantity: number;
  unit: string;
  fournisseurIds: number[];
}

export interface MatierePremiereCreateDto {
  name: string;
  stockMinimum: number;
  stockQuantity: number;
  unit: string;
  fournisseurIds: number[];
}

export interface MatierePremiereUpdateDto {
  name: string;
  stockMinimum: number;
  stockQuantity: number;
  unit: string;
  fournisseurIds: number[];
}
