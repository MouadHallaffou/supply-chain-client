export interface Fournisseur {
  fournisseurId?: number;
  name: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  leadTimeDays: number;
  rating: number;
}

export interface FournisseurCreateDto {
  name: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  leadTimeDays: number;
  rating: number;
}

export interface FournisseurUpdateDto {
  name: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  leadTimeDays: number;
  rating: number;
}

