import { createReducer, on } from '@ngrx/store';
import { initialClientState, ClientState } from './client.state';
import * as ClientActions from './client.actions';

export const clientReducer = createReducer(
  initialClientState,
  on(ClientActions.loadClients, (state, { queryParams }) => ({
    ...state,
    loading: true,
    queryParams: { ...state.queryParams, ...queryParams }
  })),
  on(ClientActions.loadClientsSuccess, (state, { clients, totalElements, totalPages, page, size }) => ({
    ...state,
    clients,
    pagination: {
      totalElements,
      totalPages,
      page,
      size
    },
    loading: false,
    loaded: true,
    error: null
  })),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ClientActions.updateQueryParams, (state, { queryParams }) => ({
    ...state,
    queryParams: { ...state.queryParams, ...queryParams }
  }))
);
