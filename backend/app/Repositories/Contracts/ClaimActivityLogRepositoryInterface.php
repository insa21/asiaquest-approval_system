<?php

namespace App\Repositories\Contracts;

use App\Enums\ClaimStatus;
use App\Models\Claim;
use App\Models\ClaimActivityLog;
use App\Models\User;

interface ClaimActivityLogRepositoryInterface
{
    public function createStatusLog(
        Claim $claim,
        User $actor,
        ?ClaimStatus $oldStatus,
        ClaimStatus $newStatus,
        string $action,
        ?string $notes = null
    ): ClaimActivityLog;
}