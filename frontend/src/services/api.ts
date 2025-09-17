import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
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
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  async getMe(): Promise<UserResponse> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Product endpoints
  async getProducts(params?: ProductParams): Promise<ProductsResponse> {
    const response = await this.api.get('/products', { params });
    return response.data;
  }

  async getProduct(id: string): Promise<ProductResponse> {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async getFeaturedProducts(limit?: number): Promise<FeaturedProductsResponse> {
    const response = await this.api.get('/products/featured', { 
      params: limit ? { limit } : {} 
    });
    return response.data;
  }

  async searchProducts(query: string): Promise<SearchResponse> {
    const response = await this.api.get('/products/search', { 
      params: { q: query } 
    });
    return response.data;
  }

  // Category endpoints
  async getCategories(): Promise<CategoriesResponse> {
    const response = await this.api.get('/categories');
    return response.data;
  }

  async getCategory(id: string, params?: CategoryParams): Promise<CategoryResponse> {
    const response = await this.api.get(`/categories/${id}`, { params });
    return response.data;
  }

  // Cart endpoints
  async getCart(): Promise<CartResponse> {
    const response = await this.api.get('/cart');
    return response.data;
  }

  async addToCart(data: AddToCartData): Promise<CartItemResponse> {
    const response = await this.api.post('/cart/add', data);
    return response.data;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItemResponse> {
    const response = await this.api.put(`/cart/${id}`, { quantity });
    return response.data;
  }

  async removeFromCart(id: string): Promise<void> {
    await this.api.delete(`/cart/${id}`);
  }

  // Wishlist endpoints
  async getWishlist(): Promise<WishlistResponse> {
    const response = await this.api.get('/wishlist');
    return response.data;
  }

  async addToWishlist(productId: string): Promise<void> {
    await this.api.post(`/wishlist/add/${productId}`);
  }

  async removeFromWishlist(productId: string): Promise<void> {
    await this.api.delete(`/wishlist/remove/${productId}`);
  }

  async checkWishlist(productId: string): Promise<WishlistCheckResponse> {
    const response = await this.api.get(`/wishlist/check/${productId}`);
    return response.data;
  }

  // Order endpoints
  async getOrders(params?: OrderParams): Promise<OrdersResponse> {
    const response = await this.api.get('/orders', { params });
    return response.data;
  }

  async getOrder(id: string): Promise<OrderResponse> {
    const response = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(data: CreateOrderData): Promise<OrderResponse> {
    const response = await this.api.post('/orders', data);
    return response.data;
  }

  async cancelOrder(id: string): Promise<void> {
    await this.api.post(`/orders/${id}/cancel`);
  }

  // Review endpoints
  async getProductReviews(productId: string, params?: ReviewParams): Promise<ReviewsResponse> {
    const response = await this.api.get(`/products/${productId}/reviews`, { params });
    return response.data;
  }

  async createReview(data: CreateReviewData): Promise<ReviewResponse> {
    const response = await this.api.post('/reviews', data);
    return response.data;
  }

  async updateReview(id: string, data: UpdateReviewData): Promise<ReviewResponse> {
    const response = await this.api.put(`/reviews/${id}`, data);
    return response.data;
  }

  async deleteReview(id: string): Promise<void> {
    await this.api.delete(`/reviews/${id}`);
  }

  // User endpoints
  async getUserProfile(): Promise<UserProfileResponse> {
    const response = await this.api.get('/user/profile');
    return response.data;
  }

  async updateUserProfile(data: UpdateUserData): Promise<UserResponse> {
    const response = await this.api.put('/user/profile', data);
    return response.data;
  }

  async getUserAddresses(): Promise<AddressesResponse> {
    const response = await this.api.get('/user/addresses');
    return response.data;
  }

  async addAddress(data: AddAddressData): Promise<AddressResponse> {
    const response = await this.api.post('/user/addresses', data);
    return response.data;
  }

  async updateAddress(id: string, data: UpdateAddressData): Promise<AddressResponse> {
    const response = await this.api.put(`/user/addresses/${id}`, data);
    return response.data;
  }

  async deleteAddress(id: string): Promise<void> {
    await this.api.delete(`/user/addresses/${id}`);
  }
}

// Types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
}

export interface UserResponse {
  success: boolean;
  data: {
    user: User;
    permissions?: string[];
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductParams {
  category_id?: string;
  category_slug?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  size?: string;
  color?: string;
  featured?: boolean;
  sort_by?: string;
  sort_order?: string;
  per_page?: number;
  page?: number;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: Pagination;
    filters: {
      categories: Category[];
      brands: string[];
      price_range: {
        min: number;
        max: number;
      };
    };
  };
}

export interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
    related_products: Product[];
    available_attributes: Record<string, string[]>;
  };
}

export interface FeaturedProductsResponse {
  success: boolean;
  data: {
    products: Product[];
  };
}

export interface SearchResponse {
  success: boolean;
  data: {
    query: string;
    products: Product[];
    pagination: Pagination;
  };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  sku: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  in_stock: boolean;
  status: string;
  featured: boolean;
  brand?: string;
  average_rating: number;
  review_count: number;
  images: ProductImage[];
  categories: Category[];
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  in_stock: boolean;
  attributes: Record<string, any>;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
}

export interface CategoryParams {
  min_price?: number;
  max_price?: number;
  brand?: string;
  sort_by?: string;
  sort_order?: string;
  per_page?: number;
  page?: number;
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

export interface CategoryResponse {
  success: boolean;
  data: {
    category: Category;
    products: Product[];
    pagination: Pagination;
  };
}

export interface AddToCartData {
  product_id: number;
  product_variant_id?: number;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  data: {
    cart_items: CartItem[];
    totals: {
      subtotal: number;
      total_items: number;
      tax_estimate: number;
      shipping_estimate: number;
      total_estimate: number;
    };
  };
}

export interface CartItemResponse {
  success: boolean;
  message: string;
  data: {
    cart_item: CartItem;
    cart_count: number;
  };
}

export interface CartItem {
  id: number;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total_price: number;
  current_price: number;
  is_available: boolean;
  available_stock: number;
}

export interface WishlistResponse {
  success: boolean;
  data: {
    wishlist_items: WishlistItem[];
    pagination: Pagination;
  };
}

export interface WishlistCheckResponse {
  success: boolean;
  data: {
    in_wishlist: boolean;
  };
}

export interface WishlistItem {
  id: number;
  product: Product;
  created_at: string;
}

export interface OrderParams {
  status?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: Pagination;
  };
}

export interface OrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

export interface CreateOrderData {
  shipping_address_id: number;
  billing_address_id: number;
  shipping_method?: string;
  payment_method: string;
  notes?: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  payment_method: string;
  shipping_address: Address;
  billing_address: Address;
  shipping_method?: string;
  notes?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  variant?: ProductVariant;
  product_name: string;
  product_sku: string;
  product_attributes?: Record<string, any>;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ReviewParams {
  rating?: number;
  sort_by?: string;
  page?: number;
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: Pagination;
    rating_summary: {
      average_rating: number;
      total_reviews: number;
      rating_distribution: Record<number, number>;
    };
  };
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: {
    review: Review;
  };
}

export interface CreateReviewData {
  product_id: number;
  order_id?: number;
  rating: number;
  title?: string;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface Review {
  id: number;
  user: User;
  product_id: number;
  order_id?: number;
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_votes_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: {
    user: User;
    stats: {
      total_orders: number;
      total_spent: number;
      total_reviews: number;
      wishlist_count: number;
      cart_count: number;
    };
  };
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
}

export interface AddressesResponse {
  success: boolean;
  data: {
    addresses: Address[];
  };
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data: {
    address: Address;
  };
}

export interface AddAddressData {
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default?: boolean;
}

export interface UpdateAddressData {
  type?: 'shipping' | 'billing';
  first_name?: string;
  last_name?: string;
  company?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  is_default?: boolean;
}

export interface Address {
  id: number;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export const apiService = new ApiService();
export default apiService;