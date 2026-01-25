import { createReducer, on } from '@ngrx/store';
import { initialClientOrderState } from './client-order.state';
import * as ClientOrderActions from './client-order.actions';

export const clientOrderReducer = createReducer(
  initialClientOrderState,

  // Load All
  on(ClientOrderActions.loadClientOrders, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClientOrderActions.loadClientOrdersSuccess, (state, { clientOrders, totalElements, totalPages, currentPage }) => ({
    ...state,
    clientOrders,
    totalElements,
    totalPages,
    currentPage,
    loading: false,
    error: null
  })),
  on(ClientOrderActions.loadClientOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load By ID
  on(ClientOrderActions.loadClientOrderById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClientOrderActions.loadClientOrderByIdSuccess, (state, { clientOrder }) => ({
    ...state,
    selectedClientOrder: clientOrder,
    loading: false,
    error: null
  })),
  on(ClientOrderActions.loadClientOrderByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load By Status
  on(ClientOrderActions.loadClientOrdersByStatus, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClientOrderActions.loadClientOrdersByStatusSuccess, (state, { clientOrders, totalElements, totalPages, currentPage }) => ({
    ...state,
    clientOrders,
    totalElements,
    totalPages,
    currentPage,
    loading: false,
    error: null
  })),
  on(ClientOrderActions.loadClientOrdersByStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create
  on(ClientOrderActions.createClientOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClientOrderActions.createClientOrderSuccess, (state, { clientOrder }) => ({
    ...state,
    clientOrders: [clientOrder, ...state.clientOrders],
    loading: false,
    error: null
  })),
  on(ClientOrderActions.createClientOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update
  on(ClientOrderActions.updateClientOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClientOrderActions.updateClientOrderSuccess, (state, { clientOrder }) => ({
    ...state,
    clientOrders: state.clientOrders.map(o =>
      o.orderId === clientOrder.orderId ? clientOrder : o
    ),
    selectedClientOrder: state.selectedClientOrder?.orderId === clientOrder.orderId
      ? clientOrder
      : state.selectedClientOrder,
    loading: false,
    error: null
  })),
  on(ClientOrderActions.updateClientOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Cancel
  on(ClientOrderActions.cancelClientOrder, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ClientOrderActions.cancelClientOrderSuccess, (state, { clientOrder }) => ({
    ...state,
    clientOrders: state.clientOrders.map(o =>
      o.orderId === clientOrder.orderId ? clientOrder : o
    ),
    selectedClientOrder: state.selectedClientOrder?.orderId === clientOrder.orderId
      ? clientOrder
      : state.selectedClientOrder,
    loading: false,
    error: null
  })),
  on(ClientOrderActions.cancelClientOrderFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Clear Error
  on(ClientOrderActions.clearClientOrderError, (state) => ({
    ...state,
    error: null
  }))
);
