<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Demo User', 'email' => 'user@example.com', 'role' => UserRole::User->value],
            ['name' => 'Demo Verifier', 'email' => 'verifier@example.com', 'role' => UserRole::Verifier->value],
            ['name' => 'Demo Approver', 'email' => 'approver@example.com', 'role' => UserRole::Approver->value],
        ];

        foreach ($users as $item) {
            $user = User::firstOrCreate(
                ['email' => $item['email']],
                [
                    'name' => $item['name'],
                    'password' => Hash::make('password'),
                ]
            );

            $user->assignRole($item['role']);
        }
    }
}