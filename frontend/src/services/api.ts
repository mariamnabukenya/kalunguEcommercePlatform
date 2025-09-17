import axios, { AxiosResponse } from 'axios';
import type {
  User,
  Product,
  Category,
  Order,
  CartItem,
  Review,
  WishlistItem,
  Address,
  ApiResponse,
  PaginatedResponse,
  ProductSearchParams,
  LoginForm,
  RegisterForm,
  CheckoutData,
  AuthUser,
  ProductFilters,
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  async login(credentials: LoginForm): Promise<{ user: AuthUser; token: string }> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterForm): Promise<{ user: AuthUser; token: string }> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getProfile(): Promise<AuthUser> {
    const response = await api.get('/user/profile');
    return response.data.user;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/user/profile', data);
    return response.data.user;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  async getProducts(params?: ProductSearchParams): Promise<{ products: Product[]; pagination: any; filters: ProductFilters }> {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getProduct(id: number): Promise<{ product: Product; related_products: Product[]; available_attributes: Record<string, string[]> }> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getFeaturedProducts(limit?: number): Promise<{ products: Product[] }> {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  async searchProducts(query: string, page = 1): Promise<{ products: Product[]; pagination: any }> {
    const response = await api.get('/products/search', { 
      params: { q: query, page } 
    });
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data.categories || [];
  },

  async getCategory(slug: string): Promise<{ category: Category; products: Product[] }> {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  async getCart(): Promise<CartItem[]> {
    const response = await api.get('/cart');
    return response.data.items || [];
  },

  async addToCart(productId: number, quantity = 1, variantId?: number): Promise<{ message: string; item: CartItem }> {
    const response = await api.post('/cart/add', {
      product_id: productId,
      quantity,
      product_variant_id: variantId,
    });
    return response.data;
  },

  async updateCartItem(itemId: number, quantity: number): Promise<{ message: string; item: CartItem }> {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  async removeFromCart(itemId: number): Promise<{ message: string }> {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  },

  async clearCart(): Promise<{ message: string }> {
    const response = await api.delete('/cart');
    return response.data;
  },
};

// Wishlist API
export const wishlistAPI = {
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await api.get('/wishlist');
    return response.data.items || [];
  },

  async addToWishlist(productId: number): Promise<{ message: string }> {
    const response = await api.post(`/wishlist/add/${productId}`);
    return response.data;
  },

  async removeFromWishlist(productId: number): Promise<{ message: string }> {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  },

  async checkWishlist(productId: number): Promise<{ in_wishlist: boolean }> {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  },

  async moveToCart(productId: number): Promise<{ message: string }> {
    const response = await api.post(`/wishlist/move-to-cart/${productId}`);
    return response.data;
  },

  async clearWishlist(): Promise<{ message: string }> {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  async getOrders(page = 1): Promise<{ orders: Order[]; pagination: any }> {
    const response = await api.get('/orders', { params: { page } });
    return response.data;
  },

  async getOrder(id: number): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data.order;
  },

  async createOrder(orderData: CheckoutData): Promise<{ order: Order; message: string }> {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async cancelOrder(id: number): Promise<{ message: string }> {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },

  async trackOrder(id: number): Promise<{ tracking_info: any }> {
    const response = await api.get(`/orders/${id}/track`);
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  async getProductReviews(productId: number): Promise<Review[]> {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data.reviews || [];
  },

  async getUserReviews(): Promise<Review[]> {
    const response = await api.get('/user/reviews');
    return response.data.reviews || [];
  },

  async createReview(data: { product_id: number; rating: number; title?: string; comment?: string }): Promise<{ review: Review; message: string }> {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  async updateReview(id: number, data: { rating: number; title?: string; comment?: string }): Promise<{ review: Review; message: string }> {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  async deleteReview(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  async markHelpful(id: number): Promise<{ message: string }> {
    const response = await api.post(`/reviews/${id}/helpful`);
    return response.data;
  },
};

// Addresses API
export const addressesAPI = {
  async getAddresses(): Promise<Address[]> {
    const response = await api.get('/user/addresses');
    return response.data.addresses || [];
  },

  async addAddress(address: Omit<Address, 'id' | 'user_id'>): Promise<{ address: Address; message: string }> {
    const response = await api.post('/user/addresses', address);
    return response.data;
  },

  async updateAddress(id: number, address: Partial<Address>): Promise<{ address: Address; message: string }> {
    const response = await api.put(`/user/addresses/${id}`, address);
    return response.data;
  },

  async deleteAddress(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/user/addresses/${id}`);
    return response.data;
  },
};

export default api;