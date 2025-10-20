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
                'category_name' => 'Electronics',
                'slug' => Str::slug('Electronics'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_name' => 'Fashion',
                'slug' => Str::slug('Fashion'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_name' => 'Home & Kitchen',
                'slug' => Str::slug('Home & Kitchen'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_name' => 'Sports',
                'slug' => Str::slug('Sports'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category_name' => 'Books',
                'slug' => Str::slug('Books'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
