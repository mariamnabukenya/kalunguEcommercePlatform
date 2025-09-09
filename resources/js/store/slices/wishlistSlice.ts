import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface WishlistState {
  items: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async () => {
    const response = await api.get('/api/wishlist');
    return response.data;
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: number) => {
    const response = await api.post(`/api/wishlist/add/${productId}`);
    return { productId, ...response.data };
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: number) => {
    await api.delete(`/api/wishlist/remove/${productId}`);
    return productId;
  }
);

export const checkWishlist = createAsyncThunk(
  'wishlist/checkWishlist',
  async (productId: number) => {
    const response = await api.get(`/api/wishlist/check/${productId}`);
    return { productId, inWishlist: response.data.in_wishlist };
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.wishlist_items;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })
      
      // Add to wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // Add the product to wishlist items if not already there
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product.id !== action.payload);
      });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;