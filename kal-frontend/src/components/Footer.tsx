import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
} from "lucide-react";

const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-gradient-to-r from-brand-brown via-brand-brown/90 to-brand-green text-brand-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-brand-green rounded-md flex items-center justify-center">
                <span className="text-brand-cream font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-bold text-brand-cream">
                Kalungu
              </span>
            </div>
            <p className="text-sm leading-relaxed text-brand-cream/80 mb-6">
              Premium clothing brand offering sustainable garments made from
              banana fibre. Quality, style, and comfort in every piece.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-brand-terracotta transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-brand-terracotta transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-brand-terracotta transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <button
              onClick={() => toggleSection("quick")}
              className="w-full flex justify-between items-center md:block md:cursor-default"
            >
              <h3 className="text-lg font-semibold text-brand-cream">
                Quick Links
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-brand-olive md:hidden transition-transform ${
                  openSection === "quick" ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`mt-4 space-y-3 text-sm md:block ${
                openSection === "quick" ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link
                  to="/products"
                  className="hover:text-brand-terracotta transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products?featured=true"
                  className="hover:text-brand-terracotta transition-colors"
                >
                  Featured Items
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=men"
                  className="hover:text-brand-terracotta transition-colors"
                >
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=women"
                  className="hover:text-brand-terracotta transition-colors"
                >
                  Women's Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <button
              onClick={() => toggleSection("service")}
              className="w-full flex justify-between items-center md:block md:cursor-default"
            >
              <h3 className="text-lg font-semibold text-brand-cream">
                Customer Service
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-brand-olive md:hidden transition-transform ${
                  openSection === "service" ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`mt-4 space-y-3 text-sm md:block ${
                openSection === "service" ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link
                  to="/contact"
                  className="hover:text-brand-terracotta transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-brand-terracotta transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-brand-terracotta transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/size-guide"
                  className="hover:text-brand-terracotta transition-colors"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <button
              onClick={() => toggleSection("contact")}
              className="w-full flex justify-between items-center md:block md:cursor-default"
            >
              <h3 className="text-lg font-semibold text-brand-cream">
                Contact Info
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-brand-olive md:hidden transition-transform ${
                  openSection === "contact" ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`mt-4 space-y-4 text-sm md:block ${
                openSection === "contact" ? "block" : "hidden md:block"
              }`}
            >
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brand-olive" />
                <span>info@kalungu.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-olive" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-olive mt-1" />
                <span>
                  123 Fashion Street
                  <br /> New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-olive mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-cream/80">
          <p>
            © {new Date().getFullYear()} Kalungu Clothing. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="hover:text-brand-terracotta transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-brand-terracotta transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
