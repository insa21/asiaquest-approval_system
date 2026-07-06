<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Register
     *
     * Register user baru dengan role default user.
     *
     * @group Authentication
     * @unauthenticated
     *
     * @bodyParam name string required Nama user. Example: Demo User
     * @bodyParam email string required Email user. Example: user@example.com
     * @bodyParam password string required Password minimal 8 karakter. Example: password
     */

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => Hash::make($request->validated('password')),
        ]);

        $user->assignRole(UserRole::User->value);

        $token = $user->createToken('api-token')->plainTextToken;

        return $this->success([
            'token' => $token,
            'user' => $this->formatUser($user),
        ], 'Register successful.', 201);
    }

    /**
     * Login
     *
     * Login menggunakan akun demo.
     *
     * @group Authentication
     * @unauthenticated
     *
     * @bodyParam email string required Email akun demo. Example: user@example.com
     * @bodyParam password string required Password akun demo. Example: password
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Invalid credentials.',
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return $this->success([
            'token' => $token,
            'user' => $this->formatUser($user),
        ], 'Login successful.');
    }

    /**
     * Get current user
     *
     * Mengambil data user yang sedang login.
     *
     * @group Authentication
     * @authenticated
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success([
            'user' => $this->formatUser($request->user()),
        ], 'Profile retrieved successfully.');
    }

    /**
     * Logout
     *
     * Menghapus token aktif user.
     *
     * @group Authentication
     * @authenticated
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return $this->success(
            message: 'Logout successful.'
        );
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),
        ];
    }
}