import { createContext, useContext } from "react";
import type { CartItem } from "../../types/CartItem";

interface CartContextType {
    cartItems: CartItem[];
    totalAmount: number;
    addItemToCart: (productId: string) => void;
    updateItemInCart: (productId: string, quantity: number) => void;
    deleteItemInCart: (productId: string) => void;
    clearCart: ()=> void;
}

export const CartContext = createContext<CartContextType>({

    cartItems: [],
    totalAmount: 0,
    addItemToCart: () => {},
    updateItemInCart: () => {},
    deleteItemInCart: ()=> {},
    clearCart: ()=> {},
});

export const useCart = () => useContext(CartContext);
