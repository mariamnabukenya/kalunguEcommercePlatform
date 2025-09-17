<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Create parent categories first
        $menId = DB::table('categories')->insertGetId([
            'name' => 'Men',
            'description' => 'Men\'s clothing and accessories',
            'slug' => 'men',
            'is_active' => true,
            'sort_order' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $womenId = DB::table('categories')->insertGetId([
            'name' => 'Women',
            'description' => 'Women\'s clothing and accessories',
            'slug' => 'women',
            'is_active' => true,
            'sort_order' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $accessoriesId = DB::table('categories')->insertGetId([
            'name' => 'Accessories',
            'description' => 'Bags, belts, jewelry, and other accessories',
            'slug' => 'accessories',
            'is_active' => true,
            'sort_order' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create subcategories
        DB::table('categories')->insert([
            // Men's subcategories
            [
                'name' => 'Men\'s Shirts',
                'description' => 'Dress shirts, casual shirts, and t-shirts',
                'slug' => 'mens-shirts',
                'parent_id' => $menId,
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Men\'s Pants',
                'description' => 'Jeans, chinos, and formal trousers',
                'slug' => 'mens-pants',
                'parent_id' => $menId,
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Men\'s Outerwear',
                'description' => 'Jackets, coats, and blazers',
                'slug' => 'mens-outerwear',
                'parent_id' => $menId,
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Women's subcategories
            [
                'name' => 'Women\'s Tops',
                'description' => 'Blouses, t-shirts, and tank tops',
                'slug' => 'womens-tops',
                'parent_id' => $womenId,
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Women\'s Bottoms',
                'description' => 'Jeans, skirts, and pants',
                'slug' => 'womens-bottoms',
                'parent_id' => $womenId,
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Women\'s Dresses',
                'description' => 'Casual and formal dresses',
                'slug' => 'womens-dresses',
                'parent_id' => $womenId,
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
            // Accessories subcategories
            [
                'name' => 'Bags',
                'description' => 'Handbags, backpacks, and wallets',
                'slug' => 'bags',
                'parent_id' => $accessoriesId,
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jewelry',
                'description' => 'Necklaces, bracelets, and rings',
                'slug' => 'jewelry',
                'parent_id' => $accessoriesId,
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
