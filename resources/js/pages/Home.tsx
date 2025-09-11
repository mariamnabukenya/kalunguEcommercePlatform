import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchFeaturedProducts } from '../store/slices/productSlice';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredProducts, isLoading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Style with Kalunga Fashion
            </h1>
            <p className="text-xl mb-8">
              Explore our curated collection of premium clothing and accessories. 
              From casual wear to formal attire, find the perfect pieces that express your unique style.
            </p>
            <div className="flex space-x-4">
              <Link 
                to="/products" 
                className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
              <Link 
                to="/products?featured=true" 
                className="border border-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Sale
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Men's Clothing", image: "https://via.placeholder.com/400x300/1F2937/FFFFFF?text=Men's+Clothing", link: "/category/mens-clothing" },
              { name: "Women's Clothing", image: "https://via.placeholder.com/400x300/EC4899/FFFFFF?text=Women's+Clothing", link: "/category/womens-clothing" },
              { name: "Accessories", image: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=Accessories", link: "/category/accessories" },
              { name: "Shoes", image: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Shoes", link: "/category/shoes" }
            ].map((category) => (
              <Link 
                key={category.name}
                to={category.link}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link 
              to="/products?featured=true" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <div className="skeleton h-48 mb-4"></div>
                  <div className="skeleton h-4 mb-2"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/products/${product.id}`}>
                    <div className="relative">
                      <img 
                        src={product.images?.[0]?.image_url || 'https://via.placeholder.com/400x400/F3F4F6/6B7280?text=No+Image'} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {product.sale_price && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                          Sale
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < product.average_rating ? 'star' : 'star-empty'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({product.review_count})
                        </span>
                      </div>
                      <div className="flex items-center">
                        {product.sale_price ? (
                          <>
                            <span className="price-sale mr-2">${product.sale_price}</span>
                            <span className="price-original">${product.price}</span>
                          </>
                        ) : (
                          <span className="price-regular">${product.price}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on all orders over $100</p>
            </div>
            
            <div>
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">Premium quality materials and craftsmanship</p>
            </div>
            
            <div>
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
              <p className="text-gray-600">24/7 customer service and support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;