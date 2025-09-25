import React from 'react';
import { Product } from '../types';
import Badge from './Badge';
import { cn } from '../lib/utils';

interface ProductBadgesProps {
  product: Product;
  className?: string;
}

const ProductBadges: React.FC<ProductBadgesProps> = ({
  product,
  className = '',
}) => {
  const badges = [];

  // Sale badge
  if (product.on_sale && product.discount_percentage) {
    badges.push(
      <Badge key="sale" variant="sale">
        {product.discount_percentage}% OFF
      </Badge>
    );
  }

  // Featured badge
  if (product.featured) {
    badges.push(
      <Badge key="featured" variant="featured">
        Featured
      </Badge>
    );
  }

  // New badge (if product is less than 30 days old)
  if (product.created_at) {
    const createdAt = new Date(product.created_at);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 30) {
      badges.push(
        <Badge key="new" variant="new">
          New
        </Badge>
      );
    }
  }

  // Low stock badge
  if (product.stock_quantity && product.stock_quantity <= 5 && product.stock_quantity > 0) {
    badges.push(
      <Badge key="low-stock" variant="warning">
        Low Stock
      </Badge>
    );
  }

  // Out of stock badge
  if (!product.in_stock) {
    badges.push(
      <Badge key="out-of-stock" variant="danger">
        Out of Stock
      </Badge>
    );
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {badges}
    </div>
  );
};

export default ProductBadges;
