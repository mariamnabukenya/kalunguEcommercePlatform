import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const { orderNumber, total } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {/* Order Details */}
          {orderNumber && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Package className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium text-gray-900">{orderNumber}</span>
                </div>
                
                {total && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">What's Next?</h3>
            </div>
            
            <div className="text-left space-y-2 text-blue-800">
              <p>• You'll receive an email confirmation shortly</p>
              <p>• We'll send you tracking information once your order ships</p>
              <p>• You can track your order status in your account</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders">
              <Button>
                <Package className="w-4 h-4 mr-2" />
                View Orders
              </Button>
            </Link>
            
            <Link to="/products">
              <Button variant="outline">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Need help? <Link to="/contact" className="text-primary-600 hover:text-primary-700">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
