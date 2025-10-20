<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
    $table->id();

    $table->unsignedBigInteger('user_id');
    $table->unsignedBigInteger('product_id');
    $table->unsignedBigInteger('order_id')->nullable();

    $table->unsignedTinyInteger('rating'); // 1-5
    $table->string('title')->nullable();
    $table->text('comment')->nullable();

    $table->boolean('is_verified_purchase')->default(false);
    $table->boolean('is_approved')->default(false);

    $table->json('helpful_votes')->nullable();

    $table->timestamps();

    // Foreign keys
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
    $table->foreign('order_id')->references('id')->on('orders')->nullOnDelete();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
