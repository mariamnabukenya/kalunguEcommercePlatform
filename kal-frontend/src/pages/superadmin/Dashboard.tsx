import React from "react";
import { useQuery } from "react-query";
import {
  Users,
  DollarSign,
  Shield,
  Activity,
  Package,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import { apiService } from "../../lib/api";
import LoadingSpinner from "../../components/LoadingSpinner";

interface SuperAdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalOrders: number;
  totalRevenue: number;
  systemHealth: {
    status: "healthy" | "warning" | "critical";
    uptime: number;
    memoryUsage: number;
    diskUsage: number;
  };
  recentActivity: any[];
  topAdmins: any[];
  salesOverview: { date: string; gross: number; net: number; refunds: number }[];
  ordersFeed: { id: string; status: string }[];
  customerActivity: { stage: string; value: number }[];
}

const SuperAdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery<SuperAdminStats>(
    "superadmin-dashboard-stats",
    () => apiService.getSuperAdminDashboardStats(),
    { refetchInterval: 30000 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Stat Cards
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Admins",
      value: stats?.totalAdmins || 0,
      icon: Shield,
      color: "bg-purple-500",
    },
    {
      title: "Total Revenue",
      value: `UGX ${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "System Uptime",
      value: `${stats?.systemHealth?.uptime || 0}%`,
      icon: Activity,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            System overview and administration controls
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
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

        {/* Sales Overview Chart + Orders Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sales Overview
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats?.salesOverview || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="gross" stroke="#16a34a" strokeWidth={2} />
                <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="refunds" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Feed */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Orders Feed
            </h3>
            <ul className="space-y-3">
              {stats?.ordersFeed?.map((order) => (
                <li
                  key={order.id}
                  className="flex justify-between border-b border-gray-100 pb-2"
                >
                  <span className="font-medium text-gray-800">
                    #{order.id}
                  </span>
                  <span className="text-sm text-gray-600">{order.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Customer Activity Funnel */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={stats?.customerActivity || []} isAnimationActive>
                <LabelList position="right" fill="#111" stroke="none" dataKey="stage" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
