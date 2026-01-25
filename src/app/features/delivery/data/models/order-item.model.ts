export interface OrderItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

