import type { CartItem } from "../types/CartItem";
import type { CartItemApi } from "../types/Product";

export const mapCartItems = (items: CartItemApi[]): CartItem[] => {
  return items.map(({ product, quantity, unitPrice }) => ({
    productId: product._id,
    title: product.title,
    image: product.image,
    quantity,
    unitPrice
  }));
};