<?php

namespace App\Repositories\Eloquent;

use App\Enums\ClaimStatus;
use App\Models\Claim;
use App\Models\ClaimActivityLog;
use App\Models\User;
use App\Repositories\Contracts\ClaimActivityLogRepositoryInterface;

class EloquentClaimActivityLogRepository implements ClaimActivityLogRepositoryInterface
{
    public function createStatusLog(
        Claim $claim,
        User $actor,
        ?ClaimStatus $oldStatus,
        ClaimStatus $newStatus,
        string $action,
        ?string $notes = null
    ): ClaimActivityLog {
        return $claim->logs()->create([
            'actor_id' => $actor->id,
            'old_status' => $oldStatus?->value,
            'new_status' => $newStatus->value,
            'action' => $action,
            'notes' => $notes,
        ]);
    }
}