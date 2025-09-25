import React from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          colors: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          iconColor: 'text-yellow-600',
        };
      case 'processing':
        return {
          label: 'Processing',
          icon: Package,
          colors: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600',
        };
      case 'shipped':
        return {
          label: 'Shipped',
          icon: Truck,
          colors: 'bg-purple-100 text-purple-800 border-purple-200',
          iconColor: 'text-purple-600',
        };
      case 'delivered':
        return {
          label: 'Delivered',
          icon: CheckCircle,
          colors: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-600',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: XCircle,
          colors: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-600',
        };
      default:
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          icon: Package,
          colors: 'bg-gray-100 text-gray-800 border-gray-200',
          iconColor: 'text-gray-600',
        };
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        config.colors,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(iconSizeClasses[size], config.iconColor, 'mr-1')} />
      )}
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
