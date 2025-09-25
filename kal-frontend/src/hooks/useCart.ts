// src/hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { Product, ProductVariant } from "./useProducts";

export interface CartItem {
  id: number;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

const API_URL = "http://localhost:8000/api";

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/cart-items`);
      return res.data.cart_items;
    },
  });

  const addToCart = useMutation({
    mutationFn: async ({
      product_id,
      variant_id,
      quantity,
    }: {
      product_id: number;
      variant_id?: number;
      quantity: number;
    }) => {
      const res = await axios.post(`${API_URL}/cart-items`, {
        product_id,
        variant_id,
        quantity,
      });
      return res.data.cart_item;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeFromCart = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/cart-items/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  return { data, isLoading, isError, addToCart, removeFromCart };
};
