import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../../types/CartItem";
import { BASE_URL } from "../../constants/baseUrl";
import { useAuth } from "../Auth/AuthContext";
import { mapCartItems } from "../../utility/cartMapper";
import { apiFetch } from "../../utility/apiFetch";

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [error, setError] = useState("");


  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchCart = async () => {
      const cart = await apiFetch(`${BASE_URL}/cart`, {
        headers,
      })
      setCartItems(mapCartItems(cart.items));
      setTotalAmount(cart.totalAmount);
    };
    fetchCart();
  }, [token]);

  const addItemToCart = async (productId: string) => {
    try {
      const cart = await apiFetch(`${BASE_URL}/cart/items`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })
      if (!cart) {
        setError("failed to parse cart data");
      }
      setCartItems([...mapCartItems(cart.items)]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const updateItemInCart = async (productId: string, quantity: number) => {
    try {
      const cart = await apiFetch(`${BASE_URL}/cart/items`, {
         method: "PUT",
         headers,
                 body: JSON.stringify({
          productId,
          quantity,
        }),
      })
      if (!cart) {
        setError("failed to parse cart data");
      }
      setCartItems([...mapCartItems(cart.items)]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItemInCart = async (productId: string) => {
    try {
      const cart = await apiFetch(`${BASE_URL}/cart/items/${productId}`, {
        method: "DELETE",
        headers,
      })
      if (!cart) {
        setError("failed to parse cart data");
      }

      setCartItems([...mapCartItems(cart.items)]);
      setTotalAmount(cart.totalAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = async () => {
    try {
      const cart = await apiFetch(`${BASE_URL}/cart`, {
        method: "DELETE",
        headers,
      })
      if (!cart) {
        setError("failed to parse cart data");
      }

      setCartItems([]);
      setTotalAmount(0);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        addItemToCart,
        updateItemInCart,
        deleteItemInCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
