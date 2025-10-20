import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { 
  User, 
  AuthResponse, 
  Product, 
  CartItem, 
  WishlistItem, 
  Order, 
  Address, 
  Review,
  PaginatedResponse,
  ProductFilters,
  LoginForm,
  RegisterForm,
  ProfileForm,
  AddressForm,
  ReviewForm
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
        
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginForm): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/login', credentials);
    return response.data;
  }

  async register(userData: RegisterForm): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/register', userData);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/logout');
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/user/profile');
    return response.data;
  }

  async updateProfile(data: ProfileForm): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put('/user/profile', data);
    return response.data;
  }

  // Product endpoints
 // Get all products with optional filters
async getProducts(filters?: ProductFilters) {
  const response = await this.api.get('/products', { params: filters });
  // Map products to ensure product_id is used
  if (response.data?.products) {
    response.data.products = response.data.products.map((p: any) => ({
      ...p,
      id: p.product_id, // map product_id to id for frontend consistency
      categories: p.category_names || [], // map category_names
    }));
  }
  return response.data;
}

// Get single product by product_id
async getProduct(product_id: number): Promise<Product> {
  const response: AxiosResponse<Product> = await this.api.get(`/products/${product_id}`);
  const product = response.data;
  return {
    ...product,
    id: product.product_id,
    categories: product.category_names || [],
  };
}

// Get featured products
async getFeaturedProducts(): Promise<Product[]> {
  try {
    const response: AxiosResponse<any> = await this.api.get('/products/featured');
    let products: any[] = [];

    if (Array.isArray(response.data)) {
      products = response.data;
    } else if (response.data?.products) {
      products = response.data.products;
    }

    // Map product_id and categories
    return products.map((p) => ({
      ...p,
      id: p.product_id,
      categories: p.category_names || [],
    }));
  } catch {
    toast.error('Failed to fetch featured products.');
    return [];
  }
}

// Search products
async searchProducts(query: string): Promise<Product[]> {
  const response: AxiosResponse<Product[]> = await this.api.get('/products/search', {
    params: { q: query },
  });

  // Map product_id and categories
  return response.data.map((p: any) => ({
    ...p,
    id: p.product_id,
    categories: p.category_names || [],
  }));
}


  // Cart endpoints
  async getCart(): Promise<{ items: CartItem[]; totals: any }> {
  const response = await this.api.get('/cart');
  return {
    items: response.data.cart_items,
    totals: response.data.totals,
  };
}

  async addToCart(productId: number, quantity: number = 1, variantId?: number): Promise<CartItem> {
    const response: AxiosResponse<CartItem> = await this.api.post('/cart/add', {
      product_id: productId,
      quantity,
      product_variant_id: variantId,
    });
    return response.data;
  }

  async updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
    const response: AxiosResponse<CartItem> = await this.api.put(`/cart/${itemId}`, {
      quantity,
    });
    return response.data;
  }

  async removeFromCart(itemId: number): Promise<void> {
    await this.api.delete(`/cart/${itemId}`);
  }

  // Wishlist endpoints
  async getWishlist(): Promise<WishlistItem[]> {
    const response: AxiosResponse<WishlistItem[]> = await this.api.get('/wishlist');
    return response.data;
  }

  async addToWishlist(productId: number): Promise<WishlistItem> {
    const response: AxiosResponse<WishlistItem> = await this.api.post(`/wishlist/add/${productId}`);
    return response.data;
  }

  async removeFromWishlist(productId: number): Promise<void> {
    await this.api.delete(`/wishlist/remove/${productId}`);
  }

  async checkWishlist(productId: number): Promise<boolean> {
    const response: AxiosResponse<{ in_wishlist: boolean }> = await this.api.get(`/wishlist/check/${productId}`);
    return response.data.in_wishlist;
  }

  async moveToCart(productId: number): Promise<CartItem> {
    const response: AxiosResponse<CartItem> = await this.api.post(`/wishlist/move-to-cart/${productId}`);
    return response.data;
  }

  async clearWishlist(): Promise<void> {
    await this.api.delete('/wishlist/clear');
  }

  // Order endpoints
  async getOrders(): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.api.get('/user/orders');
    return response.data;
  }

  async getOrder(id: number): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(orderData: any): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.post('/orders', orderData);
    return response.data;
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.post(`/orders/${orderId}/cancel`);
    return response.data;
  }

  async trackOrder(orderId: number): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get(`/orders/${orderId}/track`);
    return response.data;
  }

  // Address endpoints
  async getAddresses(): Promise<Address[]> {
    const response: AxiosResponse<Address[]> = await this.api.get('/user/addresses');
    return response.data;
  }

  async addAddress(addressData: AddressForm): Promise<Address> {
    const response: AxiosResponse<Address> = await this.api.post('/user/addresses', addressData);
    return response.data;
  }

  async updateAddress(id: number, addressData: AddressForm): Promise<Address> {
    const response: AxiosResponse<Address> = await this.api.put(`/user/addresses/${id}`, addressData);
    return response.data;
  }

  async deleteAddress(id: number): Promise<void> {
    await this.api.delete(`/user/addresses/${id}`);
  }

  // Review endpoints
  async getProductReviews(productId: number): Promise<Review[]> {
    const response: AxiosResponse<Review[]> = await this.api.get(`/products/${productId}/reviews`);
    return response.data;
  }

  async getUserReviews(): Promise<Review[]> {
    const response: AxiosResponse<Review[]> = await this.api.get('/user/reviews');
    return response.data;
  }

  async createReview(reviewData: ReviewForm): Promise<Review> {
    const response: AxiosResponse<Review> = await this.api.post('/reviews', reviewData);
    return response.data;
  }

  async updateReview(id: number, reviewData: Partial<ReviewForm>): Promise<Review> {
    const response: AxiosResponse<Review> = await this.api.put(`/reviews/${id}`, reviewData);
    return response.data;
  }

  async deleteReview(id: number): Promise<void> {
    await this.api.delete(`/reviews/${id}`);
  }

  async markReviewHelpful(id: number): Promise<void> {
    await this.api.post(`/reviews/${id}/helpful`);
  }

  // Admin-specific endpoints

async getAdminDashboardStats(): Promise<any> {
  const response: AxiosResponse<any> = await this.api.get('/admin/stats');
  return response.data;
}

// Get all products (with pagination + search)
// Get all products (with pagination + search)
async getAdminProducts(params?: { page?: number; search?: string; per_page?: number }) {
  const response = await this.api.get('/admin/products', { params });
  return response.data;
}

// Get single product by product_id
async getAdminProduct(product_id: number) {
  const response = await this.api.get(`/admin/products/${product_id}`);
  return response.data;
}

// Create a new product
async createProduct(data: {
  name: string;
  price: number;
  description?: string;
  image?: string;
  categories: string[]; // ✅ must be array
}) {
  const response = await this.api.post('/admin/products', data);
  return response.data;
}

// Update a product by product_id
async updateProduct(product_id: number, data: {
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  categories?: string[]; // ✅ must be array
}) {
  const response = await this.api.put(`/admin/products/${product_id}`, data);
  return response.data;
}

// Delete a single product by product_id
async deleteProduct(product_id: number) {
  const response = await this.api.delete(`/admin/products/${product_id}`);
  return response.data;
}

// Bulk delete products
async bulkDeleteProducts(product_ids: number[]) {
  const response = await this.api.post('/admin/products/bulk-delete', { ids: product_ids });
  return response.data;
}

}


export const apiService = new ApiService();
export default apiService;
