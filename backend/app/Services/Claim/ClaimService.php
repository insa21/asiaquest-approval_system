<?php

namespace App\Services\Claim;

use App\DTOs\CreateClaimData;
use App\Enums\ClaimStatus;
use App\Models\Claim;
use App\Models\User;
use App\Repositories\Contracts\ClaimActivityLogRepositoryInterface;
use App\Repositories\Contracts\ClaimRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ClaimService
{
    public function __construct(
        private readonly ClaimRepositoryInterface $claims,
        private readonly ClaimActivityLogRepositoryInterface $logs,
        private readonly ClaimNumberGenerator $claimNumberGenerator,
    ) {}

    public function paginateVisibleFor(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return $this->claims->paginateVisibleFor($user, $perPage);
    }

    public function findVisibleById(User $user, int $claimId): Claim
    {
        return $this->claims->findVisibleById($user, $claimId);
    }

    public function create(CreateClaimData $data, User $user): Claim
    {
        return DB::transaction(function () use ($data, $user) {
            $claim = $this->claims->create([
                'claim_number' => 'TEMP-' . Str::ulid(),
                'user_id' => $user->id,
                'title' => $data->title,
                'description' => $data->description,
                'amount' => $data->amount,
                'status' => ClaimStatus::Draft,
            ]);

            $claim->update([
                'claim_number' => $this->claimNumberGenerator->generate($claim->id),
            ]);

            $this->logs->createStatusLog(
                claim: $claim,
                actor: $user,
                oldStatus: null,
                newStatus: ClaimStatus::Draft,
                action: 'create_claim',
                notes: 'Claim created as draft.'
            );

            return $claim->fresh(['user', 'logs.actor']);
        });
    }
}