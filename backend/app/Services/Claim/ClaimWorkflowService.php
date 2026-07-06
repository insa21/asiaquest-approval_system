<?php

namespace App\Services\Claim;

use App\Enums\ClaimStatus;
use App\Models\Claim;
use App\Models\User;
use App\Repositories\Contracts\ClaimActivityLogRepositoryInterface;
use App\Repositories\Contracts\ClaimRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ClaimWorkflowService
{
    public function __construct(
        private readonly ClaimRepositoryInterface $claims,
        private readonly ClaimActivityLogRepositoryInterface $logs,
    ) {}

    public function submit(int $claimId, User $actor, ?string $notes = null): Claim
    {
        return $this->changeStatus(
            claimId: $claimId,
            actor: $actor,
            targetStatus: ClaimStatus::Submitted,
            action: 'submit_claim',
            notes: $notes
        );
    }

    public function review(int $claimId, User $actor, ?string $notes = null): Claim
    {
        return $this->changeStatus(
            claimId: $claimId,
            actor: $actor,
            targetStatus: ClaimStatus::Reviewed,
            action: 'review_claim',
            notes: $notes
        );
    }

    public function approve(int $claimId, User $actor, ?string $notes = null): Claim
    {
        return $this->changeStatus(
            claimId: $claimId,
            actor: $actor,
            targetStatus: ClaimStatus::Approved,
            action: 'approve_claim',
            notes: $notes
        );
    }

    public function reject(int $claimId, User $actor, ?string $notes = null): Claim
    {
        return $this->changeStatus(
            claimId: $claimId,
            actor: $actor,
            targetStatus: ClaimStatus::Rejected,
            action: 'reject_claim',
            notes: $notes
        );
    }

    private function changeStatus(
        int $claimId,
        User $actor,
        ClaimStatus $targetStatus,
        string $action,
        ?string $notes = null
    ): Claim {
        return DB::transaction(function () use ($claimId, $actor, $targetStatus, $action, $notes) {
            $claim = $this->claims->findLockedById($claimId);

            $currentStatus = $claim->status;

            $this->validateTransition(
                claim: $claim,
                actor: $actor,
                currentStatus: $currentStatus,
                targetStatus: $targetStatus
            );

            $updatedClaim = $this->claims->updateStatus($claim, $targetStatus);

            $this->logs->createStatusLog(
                claim: $updatedClaim,
                actor: $actor,
                oldStatus: $currentStatus,
                newStatus: $targetStatus,
                action: $action,
                notes: $notes
            );

            return $updatedClaim->fresh(['user', 'logs.actor']);
        });
    }

    private function validateTransition(
        Claim $claim,
        User $actor,
        ClaimStatus $currentStatus,
        ClaimStatus $targetStatus
    ): void {
        $allowed = match ($currentStatus) {
            ClaimStatus::Draft => $targetStatus === ClaimStatus::Submitted
                && $actor->hasRole('user')
                && $claim->user_id === $actor->id,

            ClaimStatus::Submitted => $targetStatus === ClaimStatus::Reviewed
                && $actor->hasRole('verifier'),

            ClaimStatus::Reviewed => in_array($targetStatus, [
                ClaimStatus::Approved,
                ClaimStatus::Rejected,
            ], true) && $actor->hasRole('approver'),

            default => false,
        };

        if (! $allowed) {
            throw ValidationException::withMessages([
                'status' => 'Invalid status transition or unauthorized role.',
            ]);
        }
    }
}