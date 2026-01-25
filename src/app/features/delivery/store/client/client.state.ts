import { Client, ClientQueryParams, ClientState as ClientStateModel } from '../../data/models/client.model';

export type ClientState = ClientStateModel;

export const initialClientState: ClientState = {
  clients: [],
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  },
  loading: false,
  loaded: false,
  error: null,
  queryParams: {
    page: 0,
    size: 10,
    sortBy: 'clientId',
    sortDir: 'asc'
  }
};
