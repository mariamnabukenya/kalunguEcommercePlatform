<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->warn('⚠️ No categories found. Please run CategoriesTableSeeder first.');
            return;
        }

        foreach ($categories as $category) {
            for ($i = 1; $i <= 5; $i++) {
                $product = Product::create([
                    'name' => $category->category_name . ' Product ' . $i,
                    'slug' => Str::slug($category->category_name . ' Product ' . $i . '-' . Str::random(5)),
                    'description' => 'This is a sample product under ' . $category->category_name,
                    'short_description' => 'Short description for ' . $category->category_name . ' Product ' . $i,
                    'price' => rand(1000, 10000) / 100, // 10.00 - 100.00
                    'sale_price' => rand(500, 9000) / 100, // optional sale price
                    'stock_quantity' => rand(5, 50),
                    'manage_stock' => true,
                    'in_stock' => true,
                    'status' => 'active',
                    'sku' => Str::upper(Str::random(8)),
                    'attributes' => json_encode(['color' => 'Red', 'size' => 'M']),
                    'weight' => rand(100, 500) / 100, // 1.00 - 5.00 kg
                    'dimensions' => json_encode(['length' => 10, 'width' => 5, 'height' => 2]),
                    'featured' => rand(0,1),
                    'meta_data' => json_encode(['meta_title' => 'Sample Meta Title', 'meta_description' => 'Sample meta description']),
                    'average_rating' => rand(0, 50)/10, // 0.0 - 5.0
                    'review_count' => rand(0, 20),
                ]);

                
                DB::table('product_categories')->insert([
                    'product_id' => $product->product_id,
                    'category_id' => $category->category_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
