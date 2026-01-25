import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.state';

// Feature selector
export const selectClientState = createFeatureSelector<ClientState>('clients');

// Selectors
export const selectAllClients = createSelector(
  selectClientState,
  (state: ClientState) => state?.clients || []
);

export const selectClientLoading = createSelector(
  selectClientState,
  (state: ClientState) => state?.loading || false
);

export const selectClientError = createSelector(
  selectClientState,
  (state: ClientState) => state?.error || null
);

export const selectClientPagination = createSelector(
  selectClientState,
  (state: ClientState) => state?.pagination || {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  }
);

export const selectClientQueryParams = createSelector(
  selectClientState,
  (state: ClientState) => state?.queryParams || {
    page: 0,
    size: 10,
    sortBy: 'clientId',
    sortDir: 'asc'
  }
);

// Combined selector for view model
export const selectClientViewModel = createSelector(
  selectAllClients,
  selectClientLoading,
  selectClientError,
  selectClientPagination,
  (clients, loading, error, pagination) => ({
    clients,
    loading,
    error,
    pagination
  })
);
