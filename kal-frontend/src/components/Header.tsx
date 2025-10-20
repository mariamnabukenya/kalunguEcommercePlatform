import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search, User } from "lucide-react";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 🔑 replace with your auth state

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-lg text-gray-900">
              Kalungu banana fabrics
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-green-900 font-semibold"
                  : "text-gray-700 hover:text-green-900"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive
                  ? "text-green-900 font-semibold"
                  : "text-gray-700 hover:text-green-900"
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive
                  ? "text-green-900 font-semibold"
                  : "text-gray-700 hover:text-green-900"
              }
            >
              Training
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-green-900 font-semibold"
                  : "text-gray-700 hover:text-green-900"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-green-900 font-semibold"
                  : "text-gray-700 hover:text-green-900"
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right-side icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2 text-gray-700 hover:text-green-900">
              <Search className="w-5 h-5" />
            </button>

            {/* User/Login Icon */}
            {!isLoggedIn ? (
              <Link to="/login" className="p-2 text-gray-700 hover:text-green-900">
                <User className="w-6 h-6" />
              </Link>
            ) : (
              <Link to="/account" className="flex items-center">
                <img
                  src="/images/profile.jpg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-green-900"
                />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-700 hover:text-green-900"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 hover:text-green-900"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 hover:text-green-900"
            >
              Shop
            </Link>
            <Link
              to="/training"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 hover:text-green-900"
            >
              Training
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 hover:text-green-900"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 hover:text-green-900"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
