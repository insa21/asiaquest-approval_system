<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClaimController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/claims', [ClaimController::class, 'index']);
    Route::post('/claims', [ClaimController::class, 'store']);
    Route::get('/claims/{claim}', [ClaimController::class, 'show']);

    Route::post('/claims/{claim}/submit', [ClaimController::class, 'submit']);
    Route::post('/claims/{claim}/review', [ClaimController::class, 'review']);
    Route::post('/claims/{claim}/approve', [ClaimController::class, 'approve']);
    Route::post('/claims/{claim}/reject', [ClaimController::class, 'reject']);
});