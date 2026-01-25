import { createAction, props } from '@ngrx/store';
import { Client, ClientQueryParams } from '../../data/models/client.model';

export const loadClients = createAction(
  '[Client] Load Clients',
  props<{ queryParams?: Partial<ClientQueryParams> }>()
);

export const loadClientsSuccess = createAction(
  '[Client] Load Clients Success',
  props<{
    clients: Client[],
    totalElements: number,
    totalPages: number,
    page: number,
    size: number
  }>()
);

export const loadClientsFailure = createAction(
  '[Client] Load Clients Failure',
  props<{ error: string }>()
);

export const updateQueryParams = createAction(
  '[Client] Update Query Params',
  props<{ queryParams: Partial<ClientQueryParams> }>()
);
