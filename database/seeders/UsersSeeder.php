<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Address;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@kalunga.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '+1-555-0100',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create admin address
        Address::create([
            'user_id' => $admin->id,
            'type' => 'billing',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'address_line_1' => '123 Admin Street',
            'city' => 'New York',
            'state' => 'NY',
            'postal_code' => '10001',
            'country' => 'United States',
            'phone' => '+1-555-0100',
            'is_default' => true,
        ]);

        // Create sample customers
        $customers = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'phone' => '+1-555-0101',
                'date_of_birth' => '1990-05-15',
                'gender' => 'male',
                'addresses' => [
                    [
                        'type' => 'shipping',
                        'first_name' => 'John',
                        'last_name' => 'Doe',
                        'address_line_1' => '456 Oak Avenue',
                        'city' => 'Los Angeles',
                        'state' => 'CA',
                        'postal_code' => '90210',
                        'country' => 'United States',
                        'phone' => '+1-555-0101',
                        'is_default' => true,
                    ]
                ]
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'phone' => '+1-555-0102',
                'date_of_birth' => '1985-08-22',
                'gender' => 'female',
                'addresses' => [
                    [
                        'type' => 'shipping',
                        'first_name' => 'Jane',
                        'last_name' => 'Smith',
                        'address_line_1' => '789 Pine Street',
                        'address_line_2' => 'Apt 4B',
                        'city' => 'Chicago',
                        'state' => 'IL',
                        'postal_code' => '60601',
                        'country' => 'United States',
                        'phone' => '+1-555-0102',
                        'is_default' => true,
                    ],
                    [
                        'type' => 'billing',
                        'first_name' => 'Jane',
                        'last_name' => 'Smith',
                        'address_line_1' => '321 Elm Street',
                        'city' => 'Chicago',
                        'state' => 'IL',
                        'postal_code' => '60602',
                        'country' => 'United States',
                        'phone' => '+1-555-0102',
                        'is_default' => true,
                    ]
                ]
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike@example.com',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'phone' => '+1-555-0103',
                'date_of_birth' => '1992-12-10',
                'gender' => 'male',
                'addresses' => [
                    [
                        'type' => 'shipping',
                        'first_name' => 'Mike',
                        'last_name' => 'Johnson',
                        'address_line_1' => '654 Maple Drive',
                        'city' => 'Miami',
                        'state' => 'FL',
                        'postal_code' => '33101',
                        'country' => 'United States',
                        'phone' => '+1-555-0103',
                        'is_default' => true,
                    ]
                ]
            ],
        ];

        foreach ($customers as $customerData) {
            $addresses = $customerData['addresses'];
            unset($customerData['addresses']);

            $customerData['is_active'] = true;
            $customerData['email_verified_at'] = now();
            $customerData['last_login_at'] = now()->subDays(rand(1, 30));

            $customer = User::create($customerData);

            foreach ($addresses as $addressData) {
                $addressData['user_id'] = $customer->id;
                Address::create($addressData);
            }
        }
    }
}