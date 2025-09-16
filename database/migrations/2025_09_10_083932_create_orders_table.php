<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
                  ->default('pending');

            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('shipping_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);

            $table->string('currency', 10)->default('USD');

            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])
                  ->default('pending');
            $table->string('payment_method')->nullable();
            $table->string('payment_transaction_id')->nullable();

            $table->json('shipping_address')->nullable();
            $table->json('billing_address')->nullable();

            $table->string('shipping_method')->nullable();
            $table->string('tracking_number')->nullable();

            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
