import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Eye,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { apiService } from '../../lib/api';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const { data: analytics, isLoading } = useQuery(
    ['admin-analytics', dateRange],
    () => apiService.getAdminAnalytics({ dateRange }),
    {
      refetchInterval: 300000, // Refresh every 5 minutes
    }
  );

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  const metricCards = [
    {
      title: 'Total Revenue',
      value: `$${analytics?.revenue?.total?.toLocaleString() || 0}`,
      change: analytics?.revenue?.change || 0,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: analytics?.orders?.total?.toLocaleString() || 0,
      change: analytics?.orders?.change || 0,
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Customers',
      value: analytics?.customers?.total?.toLocaleString() || 0,
      change: analytics?.customers?.change || 0,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Page Views',
      value: analytics?.pageViews?.total?.toLocaleString() || 0,
      change: analytics?.pageViews?.change || 0,
      icon: Eye,
      color: 'bg-yellow-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">Track your store's performance and growth</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            const isPositive = metric.change >= 0;
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(metric.change)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs previous period</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${metric.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Revenue chart would be displayed here</p>
                <p className="text-sm text-gray-400">Integration with chart library needed</p>
              </div>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Orders chart would be displayed here</p>
                <p className="text-sm text-gray-400">Integration with chart library needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {analytics?.topProducts?.slice(0, 5).map((product: any, index: number) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <img
                    src={product.images?.[0]?.image_url || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales_count} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-4">
              {analytics?.topCategories?.slice(0, 5).map((category: any, index: number) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">{category.products_count} products</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{category.sales_count} sales</p>
                    <p className="text-sm text-gray-600">${category.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Analytics */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">New Customers</h4>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics?.newCustomers || 0}
              </p>
              <p className="text-sm text-gray-600">This period</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Repeat Customers</h4>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics?.repeatCustomers || 0}
              </p>
              <p className="text-sm text-gray-600">This period</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Average Order Value</h4>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${analytics?.averageOrderValue || 0}
              </p>
              <p className="text-sm text-gray-600">This period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
