import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Cart, Product } from "@/types";
import { toast } from "@/hooks/useToast";

interface CartContextValue {
  cart: Cart;
  getCart: () => Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART: Cart = { items: [], totalItems: 0, totalPrice: 0 };

function calculateCart(items: Cart["items"]): Cart {
  return {
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);

  const addToCart = (product: Product, quantity = 1) => {
    if (quantity < 1) return;

    setCart((currentCart) => {
      const existingItem = currentCart.items.find((item) => item.productId === product.id);

      const items = existingItem
        ? currentCart.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...currentCart.items, { productId: product.id, product, quantity }];

      return calculateCart(items);
    });

    toast({
      variant: "success",
      title: "Added to cart",
      description: `${product.name} was added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) =>
      calculateCart(currentCart.items.filter((item) => item.productId !== productId))
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      calculateCart(
        currentCart.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      )
    );
  };

  const clearCart = () => {
    setCart(EMPTY_CART);
  };

  const value = useMemo(
    () => ({
      cart,
      getCart: () => cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart: (productId: string) => cart.items.some((item) => item.productId === productId),
    }),
    [cart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
