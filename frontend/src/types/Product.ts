export interface Product {
    _id: string;
    image: string;
    title: string;
    unitPrice: number;
}


export interface CartItemApi {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface CartResponse {
  items: CartItemApi[];
  totalAmount: number;
}