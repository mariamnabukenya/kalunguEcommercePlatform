// src/hooks/useProducts.ts
import { useQuery } from "react-query";
import axios from "axios";

export interface ProductVariant {
  id: number;
  sku: string;
  price: string;
  sale_price?: string;
  stock_quantity: number;
  in_stock: boolean;
  attributes: Record<string, string>; // e.g. { color: "Black", engine: "V8" }
  image?: string;
  weight?: string;
  formatted_attributes?: string;
}

export interface Product {
  product_id: number;
  name: string;
  description: string;
  price: string;
  sale_price?: string;
  stock_quantity: number;
  image?: string;
  featured: boolean;
 category_name?: string;
  variants: ProductVariant[];
}

export interface AvailableAttributes {
  [key: string]: string[]; // e.g. { color: ["Black", "White"], engine: ["V6", "V8"] }
}

// Pagination wrapper from backend
interface Paginated<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

interface ProductsResponse {
  products: Paginated<Product>;
}

const API_URL = "http://localhost:8000/api"; // adjust to match your backend

// ✅ Fetch all products (returns the actual array)
export const useProducts = () =>
  useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get<ProductsResponse>(`${API_URL}/products`);
      // The product array is nested inside products.data
      return res.data.products.data;
    },
  });

// ✅ Fetch single product (with available attributes + related products)
export const useProduct = (id: number) =>
  useQuery<{ product: Product; available_attributes: AvailableAttributes }>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
