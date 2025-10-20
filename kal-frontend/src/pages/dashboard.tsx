import React from "react";
import { useAuth } from "../hooks/useAuth";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data (replace with API calls later)
  const recentOrders = [
    { id: "12345", date: "Sep 15, 2025", amount: 250000, status: "Processing" },
    { id: "12340", date: "Sep 10, 2025", amount: 500000, status: "Delivered" },
  ];

  const trainingPrograms = [
    { name: "Banana Fibre Weaving", status: "In Progress", progress: 70 },
    { name: "Banana Fibre Dyeing", status: "Starts Oct 6, 2025", progress: 0 },
  ];

  const wishlist = [
    { id: 1, name: "Banana Fibre Shirt", image: "/images/shirt1.png" },
    { id: 2, name: "Banana Fibre Jacket", image: "/images/jacket1.png" },
  ];

  const loyaltyPoints = 20000;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Welcome */}
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {user?.name || "User"}!
      </h1>
      <div className="flex space-x-4 mt-4">
        <button className="px-4 py-2 bg-green-700 text-white rounded-lg">
          Continue Shopping
        </button>
        <button className="px-4 py-2 border rounded-lg">Your Orders</button>
        <button className="px-4 py-2 border rounded-lg">Your Training</button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <ul className="space-y-4">
            {recentOrders.map((order) => (
              <li key={order.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between">
                  <span className="font-medium">#{order.id}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{order.date}</p>
                <p className="text-gray-900 font-medium">
                  UGX {order.amount.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg">
            View All Orders
          </button>
        </div>

        {/* Training Programs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Training Programs</h2>
          <div className="space-y-4">
            {trainingPrograms.map((program, idx) => (
              <div key={idx}>
                <p className="font-medium">{program.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-700 h-2 rounded-full"
                    style={{ width: `${program.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{program.status}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg">
            View Training →
          </button>
        </div>
      </div>

      {/* Wishlist + Loyalty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Wishlist */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Wishlist</h2>
          <div className="flex space-x-4">
            {wishlist.map((item) => (
              <div key={item.id} className="w-20">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-lg border"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Loyalty</h2>
          <p className="text-gray-700">
            You’ve earned <span className="font-bold">UGX {loyaltyPoints.toLocaleString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
