import React from 'react';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Package, 
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Order } from '../../types';
import OrderStatusBadge from '../OrderStatusBadge';
import Button from '../Button';

interface OrderDetailProps {
  order: Order;
  onStatusUpdate: (orderId: number, status: string) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  order,
  onStatusUpdate,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Order #{order.order_number}
          </h2>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(order.status)}
          <OrderStatusBadge status={order.status} size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Customer Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-900">{order.user?.name}</p>
              <p className="text-sm text-gray-600">{order.user?.email}</p>
            </div>
            {order.shipping_address && (
              <div>
                <p className="font-medium text-gray-900 mb-1">Shipping Address</p>
                <div className="text-sm text-gray-600">
                  <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                  <p>{order.shipping_address.address_line_1}</p>
                  {order.shipping_address.address_line_2 && (
                    <p>{order.shipping_address.address_line_2}</p>
                  )}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                  {order.shipping_address.phone && (
                    <p>Phone: {order.shipping_address.phone}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">${order.shipping_cost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">${order.tax_amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-green-600">-${order.discount_amount || 0}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-semibold text-gray-900">${order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 p-6 border-b border-gray-200">
          Order Items
        </h3>
        <div className="p-6">
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                <img
                  src={item.product?.images?.[0]?.image_url || '/placeholder-product.jpg'}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                  <p className="text-sm text-gray-600">SKU: {item.product?.sku}</p>
                  <p className="text-sm text-gray-600">Size: {item.size || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${item.price}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <p className="font-medium text-gray-900">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>
        <div className="flex items-center space-x-4">
          <select
            value={order.status}
            onChange={(e) => onStatusUpdate(order.id, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button
            onClick={() => window.print()}
            variant="outline"
          >
            Print Order
          </Button>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Order Placed</p>
              <p className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          
          {order.status !== 'pending' && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Processing</p>
                <p className="text-sm text-gray-600">
                  {order.updated_at && new Date(order.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          
          {order.status === 'shipped' && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Shipped</p>
                <p className="text-sm text-gray-600">
                  {order.updated_at && new Date(order.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          
          {order.status === 'delivered' && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Delivered</p>
                <p className="text-sm text-gray-600">
                  {order.updated_at && new Date(order.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
