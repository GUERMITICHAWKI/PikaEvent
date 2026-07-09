export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  phone: string;
  address: string;
  email?: string;
  items: OrderItemRequest[];
}

export interface OrderResponse {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  email?: string;
  total: number;
  status: string;
  createdAt: string;
}