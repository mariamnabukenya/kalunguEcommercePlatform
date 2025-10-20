<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wishlists', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->unsignedBigInteger('product_id'); // match type
    $table->foreign('product_id')
          ->references('product_id') // not 'id'
          ->on('products')
          ->onDelete('cascade');
    $table->timestamps();

    $table->unique(['user_id', 'product_id']); // Prevent duplicates
});
    }

    public function down(): void
    {
        Schema::dropIfExists('wishlists');
    }
};
