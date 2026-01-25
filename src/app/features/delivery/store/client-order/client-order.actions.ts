import { createAction, props } from '@ngrx/store';
import { ClientOrder } from '../../data/models/client-order.model';
import { ClientOrderInput } from '../../data/models/client-order-input.model';

// Load All
export const loadClientOrders = createAction(
  '[ClientOrder] Load Client Orders',
  props<{ page?: number; size?: number; sortBy?: string; sortDir?: 'asc' | 'desc' }>()
);

export const loadClientOrdersSuccess = createAction(
  '[ClientOrder] Load Client Orders Success',
  props<{ clientOrders: ClientOrder[]; totalElements: number; totalPages: number; currentPage: number }>()
);

export const loadClientOrdersFailure = createAction(
  '[ClientOrder] Load Client Orders Failure',
  props<{ error: string }>()
);

// Load By ID
export const loadClientOrderById = createAction(
  '[ClientOrder] Load Client Order By ID',
  props<{ orderId: string }>()
);

export const loadClientOrderByIdSuccess = createAction(
  '[ClientOrder] Load Client Order By ID Success',
  props<{ clientOrder: ClientOrder }>()
);

export const loadClientOrderByIdFailure = createAction(
  '[ClientOrder] Load Client Order By ID Failure',
  props<{ error: string }>()
);

// Load By Status
export const loadClientOrdersByStatus = createAction(
  '[ClientOrder] Load Client Orders By Status',
  props<{ status: string; page?: number; size?: number }>()
);

export const loadClientOrdersByStatusSuccess = createAction(
  '[ClientOrder] Load Client Orders By Status Success',
  props<{ clientOrders: ClientOrder[]; totalElements: number; totalPages: number; currentPage: number }>()
);

export const loadClientOrdersByStatusFailure = createAction(
  '[ClientOrder] Load Client Orders By Status Failure',
  props<{ error: string }>()
);

// Create
export const createClientOrder = createAction(
  '[ClientOrder] Create Client Order',
  props<{ input: ClientOrderInput }>()
);

export const createClientOrderSuccess = createAction(
  '[ClientOrder] Create Client Order Success',
  props<{ clientOrder: ClientOrder }>()
);

export const createClientOrderFailure = createAction(
  '[ClientOrder] Create Client Order Failure',
  props<{ error: string }>()
);

// Update
export const updateClientOrder = createAction(
  '[ClientOrder] Update Client Order',
  props<{ orderId: string; input: ClientOrderInput }>()
);

export const updateClientOrderSuccess = createAction(
  '[ClientOrder] Update Client Order Success',
  props<{ clientOrder: ClientOrder }>()
);

export const updateClientOrderFailure = createAction(
  '[ClientOrder] Update Client Order Failure',
  props<{ error: string }>()
);

// Cancel
export const cancelClientOrder = createAction(
  '[ClientOrder] Cancel Client Order',
  props<{ orderId: string }>()
);

export const cancelClientOrderSuccess = createAction(
  '[ClientOrder] Cancel Client Order Success',
  props<{ clientOrder: ClientOrder }>()
);

export const cancelClientOrderFailure = createAction(
  '[ClientOrder] Cancel Client Order Failure',
  props<{ error: string }>()
);

// Clear Error
export const clearClientOrderError = createAction('[ClientOrder] Clear Error');
