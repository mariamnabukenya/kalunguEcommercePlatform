// src/components/ProductCard.tsx
import React from "react";
import { Product } from "../hooks/useProducts";

interface Props {
  product: Product;
  onAddToCart?: (productId: number, variantId?: number) => void;
}

const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
  const front = product?.images?.[0] || "/placeholder.jpg";
  const back = product?.images?.[1] || front;

  return (
    <div className="group cursor-pointer flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
        <img
          src={front}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src={back}
          alt={`${product.name} alternate`}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      {/* Product Info */}
      <div className="mt-3 text-center flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-800 group-hover:text-black">
            {product.name}
          </h3>
          <p className="mt-1 text-gray-600 text-sm">
            {product.sale_price ? (
              <>
                <span className="text-red-600 font-semibold">
                  ${product.sale_price}
                </span>{" "}
                <span className="line-through text-gray-400">${product.price}</span>
              </>
            ) : (
              <>${product.price}</>
            )}
          </p>
        </div>

        {/* Add to Cart */}
        {onAddToCart && (
          <button
            className="mt-3 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm"
            onClick={() => onAddToCart(product.id)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
