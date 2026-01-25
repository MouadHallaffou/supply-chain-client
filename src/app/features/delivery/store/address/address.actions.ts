import { createAction, props } from '@ngrx/store';
import { Address, AddressRequest, AddressQueryParams } from '../../data/models/address.model';

// Load Addresses
export const loadAddresses = createAction(
  '[Address] Load Addresses',
  props<{ queryParams?: Partial<AddressQueryParams> }>()
);

export const loadAddressesSuccess = createAction(
  '[Address] Load Addresses Success',
  props<{
    addresses: Address[],
    totalElements: number,
    totalPages: number,
    page: number,
    size: number
  }>()
);

export const loadAddressesFailure = createAction(
  '[Address] Load Addresses Failure',
  props<{ error: string }>()
);

// Load Single Address
export const loadAddress = createAction(
  '[Address] Load Address',
  props<{ id: number }>()
);

export const loadAddressSuccess = createAction(
  '[Address] Load Address Success',
  props<{ address: Address }>()
);

export const loadAddressFailure = createAction(
  '[Address] Load Address Failure',
  props<{ error: string }>()
);

// Create Address
export const createAddress = createAction(
  '[Address] Create Address',
  props<{ address: AddressRequest }>()
);

export const createAddressSuccess = createAction(
  '[Address] Create Address Success',
  props<{ address: Address }>()
);

export const createAddressFailure = createAction(
  '[Address] Create Address Failure',
  props<{ error: string }>()
);

// Update Address
export const updateAddress = createAction(
  '[Address] Update Address',
  props<{ id: number; address: AddressRequest }>()
);

export const updateAddressSuccess = createAction(
  '[Address] Update Address Success',
  props<{ address: Address }>()
);

export const updateAddressFailure = createAction(
  '[Address] Update Address Failure',
  props<{ error: string }>()
);

// Delete Address
export const deleteAddress = createAction(
  '[Address] Delete Address',
  props<{ id: number }>()
);

export const deleteAddressSuccess = createAction(
  '[Address] Delete Address Success',
  props<{ id: number }>()
);

export const deleteAddressFailure = createAction(
  '[Address] Delete Address Failure',
  props<{ error: string }>()
);

// Selection
export const selectAddress = createAction(
  '[Address] Select Address',
  props<{ id: number }>()
);

export const clearSelectedAddress = createAction(
  '[Address] Clear Selected Address'
);

// Query Params
export const updateQueryParams = createAction(
  '[Address] Update Query Params',
  props<{ queryParams: Partial<AddressQueryParams> }>()
);

// Reset
export const resetAddressState = createAction(
  '[Address] Reset State'
);
