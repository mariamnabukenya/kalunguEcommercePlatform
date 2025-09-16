<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->command->warn('⚠️ No categories found. Please run CategoriesTableSeeder first.');
            return;
        }

        foreach ($categories as $category) {
            for ($i = 1; $i <= 5; $i++) {
                Product::create([
                    'name' => $category->name . ' Product ' . $i,
                    'slug' => Str::slug($category->name . ' Product ' . $i . '-' . Str::random(5)),
                    'description' => 'This is a sample product under ' . $category->name,
                    'price' => rand(1000, 10000) / 100, // price between 10.00 - 100.00
                    'stock_quantity' => rand(5, 50),
                    'status' => 'active',
                    'category' => $category->name,
                    'sku' => Str::upper(Str::random(8)),
                ]);
            }
        }
    }
}
