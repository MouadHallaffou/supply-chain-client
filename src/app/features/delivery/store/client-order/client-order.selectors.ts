import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientOrderState } from './client-order.state';

export const selectClientOrderState = createFeatureSelector<ClientOrderState>('clientOrder');

export const selectAllClientOrders = createSelector(
  selectClientOrderState,
  (state: ClientOrderState) => state.clientOrders
);

export const selectSelectedClientOrder = createSelector(
  selectClientOrderState,
  (state: ClientOrderState) => state.selectedClientOrder
);

export const selectClientOrderLoading = createSelector(
  selectClientOrderState,
  (state: ClientOrderState) => state.loading
);

export const selectClientOrderError = createSelector(
  selectClientOrderState,
  (state: ClientOrderState) => state.error
);

export const selectClientOrderTotalElements = createSelector(
  selectClientOrderState,
  (state: ClientOrderState) => state.totalElements
);

export const selectClientOrderTotalPages = createSelector(
  selectClientOrderState,
  (state: ClientOrderState) => state.totalPages
);

export const selectClientOrderCurrentPage = createSelector(
  selectClientOrderState,
  (state: ClientOrderState) => state.currentPage
);

export const selectClientOrderPageSize = createSelector(
  selectClientOrderState,
  (state: ClientOrderState) => state.pageSize
);

export const selectClientOrderPagination = createSelector(
  selectClientOrderState,
  (state: ClientOrderState) => ({
    totalElements: state.totalElements,
    totalPages: state.totalPages,
    currentPage: state.currentPage,
    pageSize: state.pageSize
  })
);
