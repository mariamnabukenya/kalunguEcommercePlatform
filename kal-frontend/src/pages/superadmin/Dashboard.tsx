import React from 'react';
import { useQuery } from 'react-query';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Star,
  Eye,
  Heart,
  Shield,
  Database,
  Server,
  Activity
} from 'lucide-react';
import { apiService } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

interface SuperAdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  averageRating: number;
  totalViews: number;
  totalWishlists: number;
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    memoryUsage: number;
    diskUsage: number;
  };
  recentActivity: any[];
  topAdmins: any[];
}

const SuperAdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery<SuperAdminStats>(
    'superadmin-dashboard-stats',
    () => apiService.getSuperAdminDashboardStats(),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Admins',
      value: stats?.totalAdmins || 0,
      icon: Shield,
      color: 'bg-purple-500',
      change: '+2',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'System Uptime',
      value: `${stats?.systemHealth?.uptime || 0}%`,
      icon: Activity,
      color: 'bg-yellow-500',
      change: '+0.1%',
      changeType: 'positive' as const,
    },
  ];

  const getSystemHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview and administration controls</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSystemHealthColor(stats?.systemHealth?.status || 'healthy')}`}>
                  {stats?.systemHealth?.status || 'healthy'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Uptime</span>
                <span className="text-sm text-gray-900">{stats?.systemHealth?.uptime || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                <span className="text-sm text-gray-900">{stats?.systemHealth?.memoryUsage || 0}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Disk Usage</span>
                <span className="text-sm text-gray-900">{stats?.systemHealth?.diskUsage || 0}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Admins</h3>
            <div className="space-y-4">
              {stats?.topAdmins?.slice(0, 5).map((admin, index) => (
                <div key={admin.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{admin.name}</p>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{admin.last_login}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
          <div className="space-y-4">
            {stats?.recentActivity?.slice(0, 10).map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'order' ? 'bg-green-500' :
                    activity.type === 'system' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
              <Users className="w-6 h-6 text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Admins</p>
              <p className="text-sm text-gray-600">Add or remove admin users</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
              <Database className="w-6 h-6 text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Database Backup</p>
              <p className="text-sm text-gray-600">Create system backup</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
              <Server className="w-6 h-6 text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">System Logs</p>
              <p className="text-sm text-gray-600">View system logs</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
              <Activity className="w-6 h-6 text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Performance</p>
              <p className="text-sm text-gray-600">Monitor performance</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
