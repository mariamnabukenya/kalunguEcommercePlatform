import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  brand?: string;
  featured: boolean;
  average_rating: number;
  review_count: number;
  images: any[];
  categories: any[];
  variants?: any[];
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  featuredProducts: Product[];
  categories: any[];
  isLoading: boolean;
  error: string | null;
  pagination: any;
  filters: any;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  featuredProducts: [],
  categories: [],
  isLoading: false,
  error: null,
  pagination: null,
  filters: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params?: any) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: number) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit = 8) => {
    const response = await api.get('/api/products/featured', { params: { limit } });
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await api.get('/api/categories');
    return response.data;
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string) => {
    const response = await api.get('/api/products/search', { params: { q: query } });
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.filters = action.payload.filters;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      
      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.product;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      
      // Fetch featured products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.products;
      })
      
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Search failed';
      });
  },
});

export const { clearError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;