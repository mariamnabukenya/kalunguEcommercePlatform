<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->after('email'); // customer, admin
            $table->string('phone')->nullable()->after('email');
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('date_of_birth');
            $table->timestamp('last_login_at')->nullable()->after('email_verified_at');
            $table->boolean('is_active')->default(true)->after('remember_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'date_of_birth', 'gender', 'last_login_at', 'is_active']);
        });
    }
};