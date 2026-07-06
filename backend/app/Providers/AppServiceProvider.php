<?php

namespace App\Providers;

use App\Repositories\Contracts\ClaimActivityLogRepositoryInterface;
use App\Repositories\Contracts\ClaimRepositoryInterface;
use App\Repositories\Eloquent\EloquentClaimActivityLogRepository;
use App\Repositories\Eloquent\EloquentClaimRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            ClaimRepositoryInterface::class,
            EloquentClaimRepository::class
        );

        $this->app->bind(
            ClaimActivityLogRepositoryInterface::class,
            EloquentClaimActivityLogRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}