import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AddressState } from './address.state';

export const selectAddressState = createFeatureSelector<AddressState>('address');

// Basic Selectors
export const selectAddresses = createSelector(
  selectAddressState,
  (state) => state.addresses
);

export const selectSelectedAddress = createSelector(
  selectAddressState,
  (state) => state.selectedAddress
);

export const selectSelectedAddressId = createSelector(
  selectAddressState,
  (state) => state.selectedAddressId
);

export const selectPagination = createSelector(
  selectAddressState,
  (state) => state.pagination
);

export const selectQueryParams = createSelector(
  selectAddressState,
  (state) => state.queryParams
);

// Loading States
export const selectLoading = createSelector(
  selectAddressState,
  (state) => state.loading
);

export const selectLoaded = createSelector(
  selectAddressState,
  (state) => state.loaded
);

export const selectSaving = createSelector(
  selectAddressState,
  (state) => state.saving
);

export const selectUpdating = createSelector(
  selectAddressState,
  (state) => state.updating
);

export const selectDeleting = createSelector(
  selectAddressState,
  (state) => state.deleting
);

// Errors
export const selectError = createSelector(
  selectAddressState,
  (state) => state.error
);

export const selectCreateError = createSelector(
  selectAddressState,
  (state) => state.createError
);

export const selectUpdateError = createSelector(
  selectAddressState,
  (state) => state.updateError
);

export const selectDeleteError = createSelector(
  selectAddressState,
  (state) => state.deleteError
);

// Combined Selectors
export const selectAddressesWithLoading = createSelector(
  selectAddresses,
  selectLoading,
  (addresses, loading) => ({
    addresses,
    loading
  })
);

export const selectAddressesWithPagination = createSelector(
  selectAddresses,
  selectPagination,
  selectLoading,
  (addresses, pagination, loading) => ({
    addresses,
    pagination,
    loading
  })
);

export const selectAddressById = (id: number) => createSelector(
  selectAddresses,
  (addresses) => addresses.find(address => address.addressId === id)
);

// UI State
export const selectAddressesListViewModel = createSelector(
  selectAddresses,
  selectPagination,
  selectLoading,
  selectError,
  (addresses, pagination, loading, error) => ({
    addresses,
    pagination,
    loading,
    error,
    isEmpty: addresses.length === 0 && !loading,
    showLoading: loading && addresses.length === 0,
    showError: !!error && addresses.length === 0,
    showContent: !loading && !error && addresses.length > 0
  })
);
