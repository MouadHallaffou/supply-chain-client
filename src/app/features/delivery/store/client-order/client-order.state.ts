import { ClientOrder } from '../../data/models/client-order.model';

export interface ClientOrderState {
  clientOrders: ClientOrder[];
  selectedClientOrder: ClientOrder | null;
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const initialClientOrderState: ClientOrderState = {
  clientOrders: [],
  selectedClientOrder: null,
  loading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10
};
