import { OrderItemInput } from './order-item.model';

export interface ClientOrderInput {
  clientId: string;
  deliveryAddressId?: string;
  items: OrderItemInput[];
}
