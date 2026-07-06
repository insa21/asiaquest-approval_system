<?php

namespace App\Services\Claim;

class ClaimNumberGenerator
{
    public function generate(int $claimId): string
    {
        return sprintf(
            'CLM-%s-%06d',
            now()->format('Ymd'),
            $claimId
        );
    }
}