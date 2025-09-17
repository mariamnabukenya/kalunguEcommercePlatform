// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'super_admin';
  phone?: string;
  last_login_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  sku: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  manage_stock: boolean;
  in_stock: boolean;
  status: 'draft' | 'active' | 'archived';
  category?: string;
  attributes?: Record<string, any>;
  weight?: number;
  dimensions?: string;
  featured: boolean;
  brand?: string;
  meta_data?: Record<string, any>;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  images?: ProductImage[];
  categories?: Category[];
  variants?: ProductVariant[];
  reviews?: Review[];
  
  // Computed properties
  current_price: number;
  on_sale: boolean;
  discount_percentage: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  attributes: Record<string, any>;
  in_stock: boolean;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  sort_order: number;
  is_active: boolean;
  meta_data?: Record<string, any>;
  
  // Relations
  parent?: Category;
  children?: Category[];
}

// Cart types
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  price: number;
  
  // Relations
  product: Product;
  variant?: ProductVariant;
}

// Order types
export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  payment_transaction_id?: string;
  shipping_address: Address;
  billing_address: Address;
  shipping_method?: string;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  items: OrderItem[];
  user: User;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  price: number;
  total_price: number;
  
  // Relations
  product: Product;
  variant?: ProductVariant;
}

// Address types
export interface Address {
  id?: number;
  user_id?: number;
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
}

// Review types
export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  title?: string;
  comment?: string;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  user: Pick<User, 'id' | 'name'>;
  product: Pick<Product, 'id' | 'name'>;
}

// Wishlist types
export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  
  // Relations
  product: Product;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface ProductFilters {
  categories?: Category[];
  brands?: string[];
  price_range?: {
    min: number;
    max: number;
  };
  sizes?: string[];
  colors?: string[];
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ProductSearchParams {
  q?: string;
  category_id?: number;
  category_slug?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  size?: string;
  color?: string;
  featured?: boolean;
  sort_by?: 'name' | 'price' | 'rating' | 'popularity' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CheckoutData {
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  shipping_method?: string;
}

// Auth types
export interface AuthUser extends User {
  stats?: {
    total_orders: number;
    total_spent: number;
    total_reviews: number;
    wishlist_count: number;
    cart_count: number;
  };
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}