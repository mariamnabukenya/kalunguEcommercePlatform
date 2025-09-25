import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem } from '../types';
import { apiService } from '../lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number, variantId?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  /** Fetch cart when user logs in */
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  /** Refresh cart items from API */
  const refreshCart = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const { items } = await apiService.getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Unable to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  /** Add product to cart */
  const addToCart = async (productId: number, quantity: number = 1, variantId?: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsLoading(true);
    try {
      const newItem = await apiService.addToCart(productId, quantity, variantId);

      setCartItems(prev => {
        const existingItem = prev.find(
          item => item.product_id === productId && item.product_variant_id === variantId
        );
        if (existingItem) {
          return prev.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, newItem];
      });

      toast.success('Item added to cart');
    } catch (error) {
      console.error('Add to cart failed:', error);
      toast.error('Failed to add item');
    } finally {
      setIsLoading(false);
    }
  };

  /** Update cart item quantity */
  const updateCartItem = async (itemId: number, quantity: number) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const updatedItem = await apiService.updateCartItem(itemId, quantity);
      setCartItems(prev =>
        prev.map(item => (item.id === itemId ? updatedItem : item))
      );
      toast.success('Cart updated');
    } catch (error) {
      console.error('Update cart failed:', error);
      toast.error('Failed to update item');
    } finally {
      setIsLoading(false);
    }
  };

  /** Remove item from cart */
  const removeFromCart = async (itemId: number) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      await apiService.removeFromCart(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed');
    } catch (error) {
      console.error('Remove from cart failed:', error);
      toast.error('Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  };

  /** Clear all items in cart */
  const clearCart = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      await Promise.all(cartItems.map(item => apiService.removeFromCart(item.id)));
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Clear cart failed:', error);
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  /** Cart helpers */
  const getCartTotal = (): number =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartItemsCount = (): number =>
    cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
