export interface OrderItemProduct {
  id: number;
  imageUrl?: string;
}

export interface OrderItem {
  id: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  product?: OrderItemProduct;
}

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  email?: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}