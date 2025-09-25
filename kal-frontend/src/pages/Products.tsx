// src/pages/ProductsPage.tsx
import React, { useState } from "react";
import { useProducts, Product } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import FiltersBar from "../components/FilterSidebar";

const ProductsPage: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();
  const [sortValue, setSortValue] = useState("");

  // Placeholder Add to Cart function
  const handleAddToCart = (productId: number) => {
    console.log("Add to cart", productId);
  };

  if (isLoading) return <p className="p-8 text-center">Loading products...</p>;

  // Simple frontend sorting example
  let sortedProducts = [...products];
  if (sortValue === "price-asc") {
    sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortValue === "price-desc") {
    sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 max-w-screen-xl mx-auto">
      <header className="py-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Best Sellers</h1>
        <p className="mt-2 text-gray-500">
          Discover our most popular trending pieces.
        </p>
      </header>

      {/* Filters Bar */}
      <FiltersBar sortValue={sortValue} onSortChange={setSortValue} />

      {/* Product Grid */}
      <section className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {sortedProducts.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </section>

      {/* Pagination / Load More */}
      <div className="text-center my-10">
        <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
          Load More
        </button>
      </div>
    </main>
  );
};

export default ProductsPage;
