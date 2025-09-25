// ...existing code...
export interface ProductsPaginatedResponse {
  products: Product[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  filters: any;
}
// ...existing code...// User Types
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

export interface AuthResponse {
  user: User;
  token: string;
}

// Product Types
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
  manage_stock: boolean;
  in_stock: boolean;
  status: 'active' | 'inactive';
  category: string;
  attributes?: Record<string, any>;
  weight?: number;
  dimensions?: string;
  featured: boolean;
  brand?: string;
  meta_data?: Record<string, any>;
  average_rating: number;
  review_count: number;
  current_price: number;
  on_sale: boolean;
  discount_percentage: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
  categories?: Category[];
  created_at: string;
  updated_at: string;
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
  name: string;
  price?: number;
  sale_price?: number;
  stock_quantity: number;
  in_stock: boolean;
  attributes: Record<string, any>;
  current_price: number;
  on_sale: boolean;
}

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
  parent?: Category;
  children?: Category[];
  products?: Product[];
}

// Cart Types
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  price: number;
  product?: Product;
  variant?: ProductVariant;
  created_at: string;
  updated_at: string;
}

export interface CartSummary {
  items: CartItem[];
  total_items: number;
  total_amount: number;
}

// Wishlist Types
export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product?: Product;
  created_at: string;
  updated_at: string;
}

// Order Types
export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
  discount_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  shipping_address: Address;
  billing_address: Address;
  notes?: string;
  items: OrderItem[];
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  price: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Address {
  id: number;
  user_id: number;
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

// Review Types
export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  title?: string;
  comment?: string;
  is_approved: boolean;
  is_helpful_count: number;
  user?: User;
  product?: Product;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Search and Filter Types
export interface ProductFilters {
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  featured?: boolean;
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating' | 'newest';
  search?: string;
  page?: number;
  per_page?: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileForm {
  name: string;
  email: string;
  phone?: string;
}

export interface AddressForm {
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

export interface ReviewForm {
  product_id: number;
  rating: number;
  title?: string;
  comment?: string;
}
