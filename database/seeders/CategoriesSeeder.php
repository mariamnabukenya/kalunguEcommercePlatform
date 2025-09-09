<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Main categories
            [
                'name' => 'Men\'s Clothing',
                'slug' => 'mens-clothing',
                'description' => 'Stylish and comfortable clothing for men',
                'parent_id' => null,
                'sort_order' => 1,
                'subcategories' => [
                    [
                        'name' => 'T-Shirts',
                        'slug' => 'mens-t-shirts',
                        'description' => 'Casual and formal t-shirts for men',
                        'sort_order' => 1,
                    ],
                    [
                        'name' => 'Shirts',
                        'slug' => 'mens-shirts',
                        'description' => 'Dress shirts and casual shirts for men',
                        'sort_order' => 2,
                    ],
                    [
                        'name' => 'Jeans',
                        'slug' => 'mens-jeans',
                        'description' => 'Denim jeans in various fits and styles',
                        'sort_order' => 3,
                    ],
                    [
                        'name' => 'Jackets',
                        'slug' => 'mens-jackets',
                        'description' => 'Jackets and outerwear for men',
                        'sort_order' => 4,
                    ],
                ]
            ],
            [
                'name' => 'Women\'s Clothing',
                'slug' => 'womens-clothing',
                'description' => 'Fashionable clothing for women',
                'parent_id' => null,
                'sort_order' => 2,
                'subcategories' => [
                    [
                        'name' => 'Dresses',
                        'slug' => 'womens-dresses',
                        'description' => 'Elegant dresses for all occasions',
                        'sort_order' => 1,
                    ],
                    [
                        'name' => 'Tops',
                        'slug' => 'womens-tops',
                        'description' => 'Stylish tops and blouses',
                        'sort_order' => 2,
                    ],
                    [
                        'name' => 'Pants',
                        'slug' => 'womens-pants',
                        'description' => 'Comfortable and stylish pants',
                        'sort_order' => 3,
                    ],
                    [
                        'name' => 'Skirts',
                        'slug' => 'womens-skirts',
                        'description' => 'Fashionable skirts for women',
                        'sort_order' => 4,
                    ],
                ]
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Fashion accessories to complete your look',
                'parent_id' => null,
                'sort_order' => 3,
                'subcategories' => [
                    [
                        'name' => 'Bags',
                        'slug' => 'bags',
                        'description' => 'Handbags, backpacks, and more',
                        'sort_order' => 1,
                    ],
                    [
                        'name' => 'Jewelry',
                        'slug' => 'jewelry',
                        'description' => 'Beautiful jewelry pieces',
                        'sort_order' => 2,
                    ],
                    [
                        'name' => 'Watches',
                        'slug' => 'watches',
                        'description' => 'Stylish watches for every occasion',
                        'sort_order' => 3,
                    ],
                    [
                        'name' => 'Sunglasses',
                        'slug' => 'sunglasses',
                        'description' => 'Trendy sunglasses and eyewear',
                        'sort_order' => 4,
                    ],
                ]
            ],
            [
                'name' => 'Shoes',
                'slug' => 'shoes',
                'description' => 'Comfortable and stylish footwear',
                'parent_id' => null,
                'sort_order' => 4,
                'subcategories' => [
                    [
                        'name' => 'Sneakers',
                        'slug' => 'sneakers',
                        'description' => 'Casual and athletic sneakers',
                        'sort_order' => 1,
                    ],
                    [
                        'name' => 'Boots',
                        'slug' => 'boots',
                        'description' => 'Boots for all seasons',
                        'sort_order' => 2,
                    ],
                    [
                        'name' => 'Sandals',
                        'slug' => 'sandals',
                        'description' => 'Comfortable sandals and flip-flops',
                        'sort_order' => 3,
                    ],
                    [
                        'name' => 'Formal Shoes',
                        'slug' => 'formal-shoes',
                        'description' => 'Elegant shoes for formal occasions',
                        'sort_order' => 4,
                    ],
                ]
            ],
        ];

        foreach ($categories as $categoryData) {
            $subcategories = $categoryData['subcategories'] ?? [];
            unset($categoryData['subcategories']);

            $category = Category::create($categoryData);

            foreach ($subcategories as $subcategoryData) {
                $subcategoryData['parent_id'] = $category->id;
                Category::create($subcategoryData);
            }
        }
    }
}