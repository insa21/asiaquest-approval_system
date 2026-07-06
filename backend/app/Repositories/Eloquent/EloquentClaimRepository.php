<?php

namespace App\Repositories\Eloquent;

use App\Enums\ClaimStatus;
use App\Models\Claim;
use App\Models\User;
use App\Repositories\Contracts\ClaimRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentClaimRepository implements ClaimRepositoryInterface
{
    public function paginateVisibleFor(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return $this->visibleQueryFor($user)
            ->latest()
            ->paginate($perPage);
    }

    public function findVisibleById(User $user, int $claimId): Claim
    {
        return $this->visibleQueryFor($user)
            ->whereKey($claimId)
            ->firstOrFail();
    }

    public function findLockedById(int $claimId): Claim
    {
        return Claim::query()
            ->whereKey($claimId)
            ->lockForUpdate()
            ->firstOrFail();
    }

    public function create(array $payload): Claim
    {
        return Claim::create($payload);
    }

    public function updateStatus(Claim $claim, ClaimStatus $status): Claim
    {
        $claim->update([
            'status' => $status,
        ]);

        return $claim->fresh(['user', 'logs.actor']);
    }

    private function visibleQueryFor(User $user): Builder
    {
        $query = Claim::query()
            ->with(['user', 'logs.actor']);

        if ($user->hasRole('user')) {
            return $query->where('user_id', $user->id);
        }

        if ($user->hasRole('verifier')) {
            return $query->where('status', ClaimStatus::Submitted->value);
        }

        if ($user->hasRole('approver')) {
            return $query->where('status', ClaimStatus::Reviewed->value);
        }

        return $query->whereRaw('1 = 0');
    }
}