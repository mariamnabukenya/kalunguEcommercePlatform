// src/pages/Home.tsx
import React, { useState } from "react";
import { useProducts, Product } from "../hooks/useProducts";
// If you have an addToCart hook/mutation, import it. (Example below)
// import { useAddToCart } from "../hooks/useCart";

const Home: React.FC = () => {
  const { data: products = [], isLoading, isError } = useProducts();
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  // Example placeholder if addToCart isn’t defined yet
  const addToCart = {
    mutate: (payload: any) => {
      console.log("Add to cart:", payload);
    },
  };

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Error fetching products.</p>;

  // Helper: find a variant that matches currently selected attributes
  const findMatchingVariant = (product: Product) => {
    return (
      product.variants.find((variant) =>
        Object.entries(selectedAttributes).every(
          ([key, value]) => variant.attributes[key] === value
        )
      ) || null
    );
  };

  return (
    <div>
      <h1>Products</h1>

      {products.map((product) => {
        const matchingVariant = findMatchingVariant(product);

        return (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              margin: 12,
              padding: 12,
              borderRadius: 6,
            }}
          >
            <h2>{product.name}</h2>
            <p>{product.description}</p>

            {/* Variant Attribute Selectors */}
            {product.variants.length > 0 && (
              <div>
                <h4>Customize:</h4>
                {Object.keys(product.variants[0].attributes).map((attrKey) => {
                  const options = [
                    ...new Set(
                      product.variants.map((v) => v.attributes[attrKey])
                    ),
                  ];
                  return (
                    <div key={attrKey} style={{ marginBottom: 8 }}>
                      <label>{attrKey}: </label>
                      <select
                        value={selectedAttributes[attrKey] || ""}
                        onChange={(e) =>
                          setSelectedAttributes((prev) => ({
                            ...prev,
                            [attrKey]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select {attrKey}</option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Price Display */}
            <p>
              Price:{" "}
              {matchingVariant
                ? matchingVariant.sale_price || matchingVariant.price
                : product.sale_price || product.price}
            </p>

            <button
              disabled={product.variants.length > 0 && !matchingVariant}
              onClick={() =>
                addToCart.mutate({
                  product_id: product.id,
                  variant_id: matchingVariant?.id,
                  quantity: 1,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
