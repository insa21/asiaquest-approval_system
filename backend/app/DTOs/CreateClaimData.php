<?php

namespace App\DTOs;

use App\Http\Requests\StoreClaimRequest;

readonly class CreateClaimData
{
    public function __construct(
        public string $title,
        public ?string $description,
        public string $amount,
    ) {}

    public static function fromRequest(StoreClaimRequest $request): self
    {
        $validated = $request->validated();

        return new self(
            title: $validated['title'],
            description: $validated['description'] ?? null,
            amount: (string) $validated['amount'],
        );
    }
}