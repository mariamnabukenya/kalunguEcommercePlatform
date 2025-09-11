import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface CartItem {
  id: number;
  product: any;
  variant?: any;
  quantity: number;
  price: number;
  total_price: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  totalAmount: 0,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await api.get('/api/cart');
    return response.data;
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: { product_id: number; quantity: number; product_variant_id?: number }) => {
    const response = await api.post('/api/cart/add', data);
    return response.data;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }: { id: number; quantity: number }) => {
    const response = await api.put(`/api/cart/${id}`, { quantity });
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id: number) => {
    await api.delete(`/api/cart/${id}`);
    return id;
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async () => {
    await api.delete('/api/cart');
    return {};
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.cart_items;
        state.totalItems = action.payload.totals.total_items;
        state.totalAmount = action.payload.totals.subtotal;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        // Refresh cart after adding item
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add to cart';
      })
      
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const itemIndex = state.items.findIndex(item => item.id === action.meta.arg.id);
        if (itemIndex >= 0) {
          state.items[itemIndex] = action.payload.cart_item;
        }
        state.totalItems = action.payload.cart_count;
      })
      
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalAmount = state.items.reduce((sum, item) => sum + item.total_price, 0);
      })
      
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;