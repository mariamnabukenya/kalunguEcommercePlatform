import { useQuery } from 'react-query';
import { apiService } from '../lib/api';

export const useOrders = () => {
  return useQuery(
    'user-orders',
    () => apiService.getOrders(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useOrder = (id: number) => {
  return useQuery(
    ['order', id],
    () => apiService.getOrder(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
};
