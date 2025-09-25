<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'name' => 'Electronics',
                'description' => 'Electronics products',
                'slug' => Str::slug('Electronics'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fashion',
                'description' => 'Clothing, shoes, and accessories',
                'slug' => Str::slug('Fashion'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Home & Kitchen',
                'description' => 'Appliances, furniture, and kitchenware',
                'slug' => Str::slug('Home & Kitchen'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sports',
                'description' => 'Sporting goods and fitness equipment',
                'slug' => Str::slug('Sports'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Books',
                'description' => 'Educational and leisure books',
                'slug' => Str::slug('Books'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
