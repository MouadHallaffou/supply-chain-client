import { OrderItem } from './order-item.model';
import { Client } from './client.model';
import { Address } from './address.model';

export enum ClientOrderStatus {
  EN_PREPARATION = 'EN_PREPARATION',
  EN_ROUTE = 'EN_ROUTE',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE'
}

export interface ClientOrder {
  orderId?: string;
  orderNumber?: string;
  clientId?: string;
  client?: Client;
  deliveryAddressId?: string;
  deliveryAddress?: Address;
  status: ClientOrderStatus;
  totalAmount?: number;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientOrderPage {
  content: ClientOrder[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ClientOrderQueryParams {
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  status?: string;
}

