export interface Product {
  productId: number;
  name: string;
  productionTimeHours: number;
  costPerUnit: number;
  stock: number;
}

export interface ProductRequestDTO {
  name: string;
  productionTimeHours: number;
  costPerUnit: number;
  stock: number;
}

export interface ProductResponseDTO {
  productId: number;
  name: string;
  productionTimeHours: number;
  costPerUnit: number;
  stock: number;
}
