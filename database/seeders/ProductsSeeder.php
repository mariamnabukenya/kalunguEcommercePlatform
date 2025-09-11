<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Men's T-Shirts
            [
                'name' => 'Classic Cotton T-Shirt',
                'description' => 'A comfortable and versatile cotton t-shirt perfect for everyday wear. Made from 100% premium cotton with a relaxed fit.',
                'short_description' => 'Comfortable cotton t-shirt for everyday wear',
                'sku' => 'MTS-001',
                'price' => 24.99,
                'sale_price' => 19.99,
                'stock_quantity' => 100,
                'brand' => 'StyleCorp',
                'featured' => true,
                'category' => 'mens-t-shirts',
                'attributes' => ['material' => 'cotton', 'fit' => 'regular'],
                'variants' => [
                    ['sku' => 'MTS-001-S-BLK', 'attributes' => ['size' => 'S', 'color' => 'black'], 'stock_quantity' => 25, 'price' => 24.99, 'sale_price' => 19.99],
                    ['sku' => 'MTS-001-M-BLK', 'attributes' => ['size' => 'M', 'color' => 'black'], 'stock_quantity' => 30, 'price' => 24.99, 'sale_price' => 19.99],
                    ['sku' => 'MTS-001-L-BLK', 'attributes' => ['size' => 'L', 'color' => 'black'], 'stock_quantity' => 25, 'price' => 24.99, 'sale_price' => 19.99],
                    ['sku' => 'MTS-001-S-WHT', 'attributes' => ['size' => 'S', 'color' => 'white'], 'stock_quantity' => 20, 'price' => 24.99, 'sale_price' => 19.99],
                    ['sku' => 'MTS-001-M-WHT', 'attributes' => ['size' => 'M', 'color' => 'white'], 'stock_quantity' => 30, 'price' => 24.99, 'sale_price' => 19.99],
                    ['sku' => 'MTS-001-L-WHT', 'attributes' => ['size' => 'L', 'color' => 'white'], 'stock_quantity' => 25, 'price' => 24.99, 'sale_price' => 19.99],
                ],
                'images' => [
                    ['image_url' => 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+T-Shirt', 'alt_text' => 'Black Cotton T-Shirt', 'is_primary' => true],
                    ['image_url' => 'https://via.placeholder.com/800x800/FFFFFF/000000?text=White+T-Shirt', 'alt_text' => 'White Cotton T-Shirt'],
                ]
            ],
            [
                'name' => 'Premium Polo Shirt',
                'description' => 'Elegant polo shirt made from premium pique cotton. Perfect for both casual and semi-formal occasions.',
                'short_description' => 'Premium pique cotton polo shirt',
                'sku' => 'MPS-001',
                'price' => 49.99,
                'stock_quantity' => 80,
                'brand' => 'StyleCorp',
                'featured' => true,
                'category' => 'mens-shirts',
                'attributes' => ['material' => 'pique cotton', 'fit' => 'slim'],
                'variants' => [
                    ['sku' => 'MPS-001-S-NVY', 'attributes' => ['size' => 'S', 'color' => 'navy'], 'stock_quantity' => 20, 'price' => 49.99],
                    ['sku' => 'MPS-001-M-NVY', 'attributes' => ['size' => 'M', 'color' => 'navy'], 'stock_quantity' => 25, 'price' => 49.99],
                    ['sku' => 'MPS-001-L-NVY', 'attributes' => ['size' => 'L', 'color' => 'navy'], 'stock_quantity' => 20, 'price' => 49.99],
                    ['sku' => 'MPS-001-XL-NVY', 'attributes' => ['size' => 'XL', 'color' => 'navy'], 'stock_quantity' => 15, 'price' => 49.99],
                ],
                'images' => [
                    ['image_url' => 'https://via.placeholder.com/800x800/000080/FFFFFF?text=Navy+Polo', 'alt_text' => 'Navy Polo Shirt', 'is_primary' => true],
                ]
            ],
            // Women's Dresses
            [
                'name' => 'Elegant Midi Dress',
                'description' => 'Beautiful midi dress perfect for special occasions. Features a flattering A-line silhouette and elegant design details.',
                'short_description' => 'Elegant A-line midi dress',
                'sku' => 'WMD-001',
                'price' => 89.99,
                'sale_price' => 69.99,
                'stock_quantity' => 60,
                'brand' => 'ElegantWear',
                'featured' => true,
                'category' => 'womens-dresses',
                'attributes' => ['material' => 'polyester blend', 'fit' => 'A-line'],
                'variants' => [
                    ['sku' => 'WMD-001-S-BLK', 'attributes' => ['size' => 'S', 'color' => 'black'], 'stock_quantity' => 15, 'price' => 89.99, 'sale_price' => 69.99],
                    ['sku' => 'WMD-001-M-BLK', 'attributes' => ['size' => 'M', 'color' => 'black'], 'stock_quantity' => 20, 'price' => 89.99, 'sale_price' => 69.99],
                    ['sku' => 'WMD-001-L-BLK', 'attributes' => ['size' => 'L', 'color' => 'black'], 'stock_quantity' => 15, 'price' => 89.99, 'sale_price' => 69.99],
                    ['sku' => 'WMD-001-M-RED', 'attributes' => ['size' => 'M', 'color' => 'red'], 'stock_quantity' => 10, 'price' => 89.99, 'sale_price' => 69.99],
                ],
                'images' => [
                    ['image_url' => 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Midi+Dress', 'alt_text' => 'Black Midi Dress', 'is_primary' => true],
                    ['image_url' => 'https://via.placeholder.com/800x800/FF0000/FFFFFF?text=Red+Midi+Dress', 'alt_text' => 'Red Midi Dress'],
                ]
            ],
            [
                'name' => 'Casual Summer Dress',
                'description' => 'Light and breezy summer dress perfect for warm weather. Made from soft, breathable fabric with a comfortable fit.',
                'short_description' => 'Light and comfortable summer dress',
                'sku' => 'WSD-001',
                'price' => 45.99,
                'stock_quantity' => 75,
                'brand' => 'SummerStyle',
                'category' => 'womens-dresses',
                'attributes' => ['material' => 'cotton blend', 'fit' => 'relaxed'],
                'variants' => [
                    ['sku' => 'WSD-001-S-FLR', 'attributes' => ['size' => 'S', 'color' => 'floral'], 'stock_quantity' => 25, 'price' => 45.99],
                    ['sku' => 'WSD-001-M-FLR', 'attributes' => ['size' => 'M', 'color' => 'floral'], 'stock_quantity' => 25, 'price' => 45.99],
                    ['sku' => 'WSD-001-L-FLR', 'attributes' => ['size' => 'L', 'color' => 'floral'], 'stock_quantity' => 25, 'price' => 45.99],
                ],
                'images' => [
                    ['image_url' => 'https://via.placeholder.com/800x800/FFC0CB/000000?text=Floral+Summer+Dress', 'alt_text' => 'Floral Summer Dress', 'is_primary' => true],
                ]
            ],
            // Accessories
            [
                'name' => 'Leather Crossbody Bag',
                'description' => 'Stylish leather crossbody bag perfect for everyday use. Features multiple compartments and adjustable strap.',
                'short_description' => 'Stylish leather crossbody bag',
                'sku' => 'LCB-001',
                'price' => 129.99,
                'stock_quantity' => 40,
                'brand' => 'LeatherCraft',
                'featured' => true,
                'category' => 'bags',
                'attributes' => ['material' => 'genuine leather', 'type' => 'crossbody'],
                'variants' => [
                    ['sku' => 'LCB-001-BLK', 'attributes' => ['color' => 'black'], 'stock_quantity' => 20, 'price' => 129.99],
                    ['sku' => 'LCB-001-BRN', 'attributes' => ['color' => 'brown'], 'stock_quantity' => 20, 'price' => 129.99],
                ],
                'images' => [
                    ['image_url' => 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Leather+Bag', 'alt_text' => 'Black Leather Crossbody Bag', 'is_primary' => true],
                    ['image_url' => 'https://via.placeholder.com/800x800/8B4513/FFFFFF?text=Brown+Leather+Bag', 'alt_text' => 'Brown Leather Crossbody Bag'],
                ]
            ],
            [
                'name' => 'Classic Wristwatch',
                'description' => 'Elegant classic wristwatch with leather strap. Features reliable quartz movement and water resistance.',
                'short_description' => 'Elegant classic wristwatch',
                'sku' => 'CWW-001',
                'price' => 199.99,
                'sale_price' => 149.99,
                'stock_quantity' => 30,
                'brand' => 'TimeKeeper',
                'category' => 'watches',
                'attributes' => ['material' => 'stainless steel', 'movement' => 'quartz'],
                'variants' => [
                    ['sku' => 'CWW-001-SLV', 'attributes' => ['color' => 'silver'], 'stock_quantity' => 15, 'price' => 199.99, 'sale_price' => 149.99],
                    ['sku' => 'CWW-001-GLD', 'attributes' => ['color' => 'gold'], 'stock_quantity' => 15, 'price' => 199.99, 'sale_price' => 149.99],
                ],
                'images' => [
                    ['image_url' => 'https://via.placeholder.com/800x800/C0C0C0/000000?text=Silver+Watch', 'alt_text' => 'Silver Classic Wristwatch', 'is_primary' => true],
                    ['image_url' => 'https://via.placeholder.com/800x800/FFD700/000000?text=Gold+Watch', 'alt_text' => 'Gold Classic Wristwatch'],
                ]
            ],
            // Shoes
            [
                'name' => 'Athletic Running Sneakers',
                'description' => 'High-performance running sneakers with advanced cushioning and breathable mesh upper. Perfect for workouts and casual wear.',
                'short_description' => 'High-performance running sneakers',
                'sku' => 'ARS-001',
                'price' => 119.99,
                'stock_quantity' => 90,
                'brand' => 'SportPro',
                'featured' => true,
                'category' => 'sneakers',
                'attributes' => ['type' => 'running', 'material' => 'mesh'],
                'variants' => [
                    ['sku' => 'ARS-001-8-BLK', 'attributes' => ['size' => '8', 'color' => 'black'], 'stock_quantity' => 15, 'price' => 119.99],
                    ['sku' => 'ARS-001-9-BLK', 'attributes' => ['size' => '9', 'color' => 'black'], 'stock_quantity' => 15, 'price' => 119.99],
                    ['sku' => 'ARS-001-10-BLK', 'attributes' => ['size' => '10', 'color' => 'black'], 'stock_quantity' => 15, 'price' => 119.99],
                    ['sku' => 'ARS-001-8-WHT', 'attributes' => ['size' => '8', 'color' => 'white'], 'stock_quantity' => 15, 'price' => 119.99],
                    ['sku' => 'ARS-001-9-WHT', 'attributes' => ['size' => '9', 'color' => 'white'], 'stock_quantity' => 15, 'price' => 119.99],
                    ['sku' => 'ARS-001-10-WHT', 'attributes' => ['size' => '10', 'color' => 'white'], 'stock_quantity' => 15, 'price' => 119.99],
                ],
                'images' => [
                    ['image_url' => 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Sneakers', 'alt_text' => 'Black Athletic Running Sneakers', 'is_primary' => true],
                    ['image_url' => 'https://via.placeholder.com/800x800/FFFFFF/000000?text=White+Sneakers', 'alt_text' => 'White Athletic Running Sneakers'],
                ]
            ],
        ];

        foreach ($products as $productData) {
            $variants = $productData['variants'] ?? [];
            $images = $productData['images'] ?? [];
            $categorySlug = $productData['category'];
            
            unset($productData['variants'], $productData['images'], $productData['category']);
            
            // Generate slug
            $productData['slug'] = Str::slug($productData['name']);
            $productData['in_stock'] = $productData['stock_quantity'] > 0;
            $productData['product_type'] = !empty($variants) ? 'variable' : 'simple';

            $product = Product::create($productData);

            // Attach to category
            $category = Category::where('slug', $categorySlug)->first();
            if ($category) {
                $product->categories()->attach($category->id);
            }

            // Create variants
            foreach ($variants as $variantData) {
                $variantData['product_id'] = $product->id;
                $variantData['in_stock'] = $variantData['stock_quantity'] > 0;
                ProductVariant::create($variantData);
            }

            // Create images
            foreach ($images as $index => $imageData) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $imageData['image_url'],
                    'alt_text' => $imageData['alt_text'],
                    'sort_order' => $index + 1,
                    'is_primary' => $imageData['is_primary'] ?? false,
                ]);
            }
        }
    }
}