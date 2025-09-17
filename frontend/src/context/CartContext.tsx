import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import type { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (productId: number, quantity?: number, variantId?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const cartItems = await cartAPI.getCart();
      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity = 1, variantId?: number) => {
    try {
      setIsLoading(true);
      const response = await cartAPI.addToCart(productId, quantity, variantId);
      
      // Check if item already exists in cart
      const existingItemIndex = items.findIndex(item => 
        item.product_id === productId && 
        item.product_variant_id === variantId
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...items];
        updatedItems[existingItemIndex].quantity += quantity;
        setItems(updatedItems);
      } else {
        // Add new item to cart
        await refreshCart();
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      setIsLoading(true);
      await cartAPI.updateCartItem(itemId, quantity);
      
      // Update local state
      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setItems(updatedItems);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setIsLoading(true);
      await cartAPI.removeFromCart(itemId);
      
      // Remove from local state
      const filteredItems = items.filter(item => item.id !== itemId);
      setItems(filteredItems);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await cartAPI.clearCart();
      setItems([]);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const value: CartContextType = {
    items,
    isLoading,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;