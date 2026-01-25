import { createReducer, on } from '@ngrx/store';
import * as AddressActions from './address.actions';
import { initialState } from './address.state';

export const addressReducer = createReducer(
  initialState,

  // Load Addresses
  on(AddressActions.loadAddresses, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AddressActions.loadAddressesSuccess, (state, { addresses, totalElements, totalPages, page, size }) => ({
    ...state,
    addresses,
    pagination: { page, size, totalElements, totalPages },
    loading: false,
    loaded: true,
    error: null
  })),

  on(AddressActions.loadAddressesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Single Address
  on(AddressActions.loadAddress, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AddressActions.loadAddressSuccess, (state, { address }) => ({
    ...state,
    selectedAddress: address,
    selectedAddressId: address.addressId,
    loading: false,
    error: null
  })),

  on(AddressActions.loadAddressFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Address
  on(AddressActions.createAddress, (state) => ({
    ...state,
    saving: true,
    createError: null
  })),

  on(AddressActions.createAddressSuccess, (state, { address }) => ({
    ...state,
    addresses: [...state.addresses, address],
    selectedAddress: address,
    selectedAddressId: address.addressId,
    saving: false,
    createError: null
  })),

  on(AddressActions.createAddressFailure, (state, { error }) => ({
    ...state,
    saving: false,
    createError: error
  })),

  // Update Address
  on(AddressActions.updateAddress, (state) => ({
    ...state,
    updating: true,
    updateError: null
  })),

  on(AddressActions.updateAddressSuccess, (state, { address }) => ({
    ...state,
    addresses: state.addresses.map(addr =>
      addr.addressId === address.addressId ? address : addr
    ),
    selectedAddress: address,
    updating: false,
    updateError: null
  })),

  on(AddressActions.updateAddressFailure, (state, { error }) => ({
    ...state,
    updating: false,
    updateError: error
  })),

  // Delete Address
  on(AddressActions.deleteAddress, (state) => ({
    ...state,
    deleting: true,
    deleteError: null
  })),

  on(AddressActions.deleteAddressSuccess, (state, { id }) => ({
    ...state,
    addresses: state.addresses.filter(addr => addr.addressId !== id),
    selectedAddress: state.selectedAddress?.addressId === id ? null : state.selectedAddress,
    selectedAddressId: state.selectedAddressId === id ? null : state.selectedAddressId,
    deleting: false,
    deleteError: null
  })),

  on(AddressActions.deleteAddressFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    deleteError: error
  })),

  // Selection
  on(AddressActions.selectAddress, (state, { id }) => ({
    ...state,
    selectedAddressId: id,
    selectedAddress: state.addresses.find(addr => addr.addressId === id) || null
  })),

  on(AddressActions.clearSelectedAddress, (state) => ({
    ...state,
    selectedAddress: null,
    selectedAddressId: null
  })),

  // Query Params
  on(AddressActions.updateQueryParams, (state, { queryParams }) => ({
    ...state,
    queryParams: { ...state.queryParams, ...queryParams }
  })),

  // Reset
  on(AddressActions.resetAddressState, () => initialState)
);
