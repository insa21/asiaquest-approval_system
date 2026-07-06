<?php

namespace App\Repositories\Contracts;

use App\Enums\ClaimStatus;
use App\Models\Claim;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface ClaimRepositoryInterface
{
    public function paginateVisibleFor(User $user, int $perPage = 10): LengthAwarePaginator;

    public function findVisibleById(User $user, int $claimId): Claim;

    public function findLockedById(int $claimId): Claim;

    public function create(array $payload): Claim;

    public function updateStatus(Claim $claim, ClaimStatus $status): Claim;
}