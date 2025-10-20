import React from "react";
import { useQuery } from "react-query";
import {
  Package,
  ShoppingBag,
  Star,
  Users,
  DollarSign,
} from "lucide-react";
import apiService from "../../lib/api";

const statCards = [
  { key: "products", title: "Products", icon: Package, color: "bg-brand-brown" },
  { key: "orders", title: "Orders", icon: ShoppingBag, color: "bg-brand-green" },
  { key: "reviews", title: "Reviews", icon: Star, color: "bg-brand-olive" },
  { key: "users", title: "Users", icon: Users, color: "bg-brand-slate" },
  { key: "revenue", title: "Revenue", icon: DollarSign, color: "bg-brand-terracotta" },
];

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery(
    "admin-dashboard-stats",
    () => apiService.getAdminDashboardStats(),
    { refetchInterval: 30000 }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((s) =>
          stats?.[s.key] !== undefined ? (
            <div key={s.key} className="rounded-lg p-6 shadow bg-white border border-border flex items-center">
              <div className={`p-3 rounded-full ${s.color} mr-4`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-slate">{s.title}</p>
                <p className="text-2xl font-bold text-brand-charcoal">
                  {s.key === "revenue" ? `$${stats[s.key]}` : stats[s.key]}
                </p>
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Recent orders + Low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow border border-border">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <ul className="divide-y divide-border">
            {stats?.recent_orders?.map((order: any) => (
              <li key={order.id} className="py-2 flex justify-between text-sm">
                <span>#{order.id} - {order.user?.name}</span>
                <span>${order.total} ({order.status})</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-lg shadow border border-border">
          <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>
          <ul className="divide-y divide-border">
            {stats?.low_stock?.map((p: any) => (
              <li key={p.id} className="py-2 flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-red-500">{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reviews + Revenue chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div className="bg-white p-6 rounded-lg shadow border border-border">
          <h2 className="text-lg font-semibold mb-4">Latest Reviews</h2>
          <ul className="divide-y divide-border">
            {stats?.recent_reviews?.map((r: any) => (
              <li key={r.id} className="py-2 text-sm">
                <p className="font-medium">{r.user?.name} on {r.product?.name}</p>
                <p className="text-yellow-500">{"★".repeat(r.rating)}</p>
                <p className="text-brand-slate">{r.comment}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Revenue Chart (basic list for now) */}
        <div className="bg-white p-6 rounded-lg shadow border border-border">
          <h2 className="text-lg font-semibold mb-4">Revenue (Last 7 Days)</h2>
          <ul className="divide-y divide-border">
            {stats?.revenue_chart?.map((day: any) => (
              <li key={day.date} className="py-2 flex justify-between text-sm">
                <span>{day.date}</span>
                <span>${day.total}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
