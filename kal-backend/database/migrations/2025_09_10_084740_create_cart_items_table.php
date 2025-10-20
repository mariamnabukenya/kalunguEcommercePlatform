<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->bigIncrements('cart_item_id'); // Custom primary key for consistency

            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('product_variant_id')->nullable();

            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('price', 10, 2);

            $table->timestamps();

            // Foreign key definitions (explicit to match custom PKs)
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->foreign('product_id')
                  ->references('product_id')
                  ->on('products')
                  ->onDelete('cascade');

            $table->foreign('product_variant_id')
                  ->references('product_variant_id')
                  ->on('product_variants')
                  ->nullOnDelete(); // set null if variant deleted
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
