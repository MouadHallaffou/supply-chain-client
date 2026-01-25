export interface Address {
  addressId: number;
  street: string;
  city: string;
  state?: string;
  country?: string;
  zipCode: string;
  clientId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddressPage {
  content: Address[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  empty: boolean;
}

export interface AddressRequest {
  street: string;
  city: string;
  state?: string;
  country?: string;
  zipCode: string;
  clientId: number;
}

export interface AddressQueryParams {
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  search?: string;
}

