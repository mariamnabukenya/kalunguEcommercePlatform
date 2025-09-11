import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ShoppingBagIcon, 
  HeartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { totalItems } = useSelector((state: RootState) => state.cart);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="py-2 text-sm text-gray-600 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span>Free shipping on orders over $100</span>
            <div className="flex items-center space-x-4">
              <span>Help & Support: (555) 123-4567</span>
              {isAdmin && (
                <Link to="/admin" className="text-blue-600 hover:text-blue-800">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Kalunga Fashion
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/wishlist" className="p-2 text-gray-600 hover:text-gray-900">
                    <HeartIcon className="h-6 w-6" />
                  </Link>
                  
                  <Link to="/cart" className="p-2 text-gray-600 hover:text-gray-900 relative">
                    <ShoppingBagIcon className="h-6 w-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>

                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900">
                      <UserIcon className="h-6 w-6" />
                      <span className="hidden md:block">{user?.name}</span>
                    </button>
                    
                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <Link 
                          to="/orders" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:block border-t border-gray-100">
          <ul className="flex space-x-8 py-4">
            <li>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                All Products
              </Link>
            </li>
            <li>
              <Link 
                to="/category/mens-clothing" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Men's
              </Link>
            </li>
            <li>
              <Link 
                to="/category/womens-clothing" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Women's
              </Link>
            </li>
            <li>
              <Link 
                to="/category/accessories" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Accessories
              </Link>
            </li>
            <li>
              <Link 
                to="/category/shoes" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Shoes
              </Link>
            </li>
            <li>
              <Link 
                to="/products?featured=true" 
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Sale
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>

            {/* Mobile navigation */}
            <nav className="space-y-2">
              <Link to="/products" className="block py-2 text-gray-700">All Products</Link>
              <Link to="/category/mens-clothing" className="block py-2 text-gray-700">Men's</Link>
              <Link to="/category/womens-clothing" className="block py-2 text-gray-700">Women's</Link>
              <Link to="/category/accessories" className="block py-2 text-gray-700">Accessories</Link>
              <Link to="/category/shoes" className="block py-2 text-gray-700">Shoes</Link>
              <Link to="/products?featured=true" className="block py-2 text-red-600">Sale</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;