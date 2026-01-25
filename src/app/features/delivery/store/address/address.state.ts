import { Address, AddressQueryParams } from '../../data/models/address.model';

export interface AddressState {
  addresses: Address[];
  selectedAddress: Address | null;
  selectedAddressId: number | null;
  queryParams: AddressQueryParams;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  totalElements: number;
  totalPages: number;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const initialState: AddressState = {
  addresses: [],
  selectedAddress: null,
  selectedAddressId: null,
  queryParams: {
    page: 0,
    size: 10,
    sortBy: 'addressId',
    sortDir: 'asc',
    search: undefined
  },
  loading: false,
  loaded: false,
  saving: false,
  updating: false,
  deleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  totalElements: 0,
  totalPages: 0,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  }
};
