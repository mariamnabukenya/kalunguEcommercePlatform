import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['admin', 'super_admin'] },
    { name: 'Products', href: '/admin/products', icon: Package, roles: ['admin', 'super_admin'] },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, roles: ['admin', 'super_admin'] },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen, roles: ['admin', 'super_admin'] },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare, roles: ['admin', 'super_admin'] },
    { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['admin', 'super_admin'] },
    { name: 'Users', href: '/admin/users', icon: Users, roles: ['super_admin'] },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['super_admin'] },
  ];

  const filteredNavigation = navigation.filter(item => item.roles.includes(user?.role || ''));

  const isCurrentPath = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-border">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              {/* Logo / Title */}
              <div className="flex items-center flex-shrink-0 px-4">
                <Shield className="h-8 w-8 text-brand-green" />
                <span className="ml-2 text-xl font-bold text-brand-charcoal">
                  Admin Panel
                </span>
              </div>

              {/* Nav links */}
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {filteredNavigation.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                        ${isCurrentPath(item.href)
                          ? 'bg-brand-beige text-brand-green'
                          : 'text-brand-charcoal hover:bg-brand-cream hover:text-brand-green'
                        }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User footer */}
            <div className="flex-shrink-0 flex border-t border-border p-4">
              <div className="flex items-center w-full">
                <div className="w-8 h-8 bg-brand-olive rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-brand-charcoal">
                    {user?.name}
                  </p>
                  <p className="text-xs text-brand-slate capitalize">
                    {user?.role}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="ml-auto text-brand-terracotta border-brand-terracotta/40 hover:bg-brand-terracotta/10"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
