<?php

namespace Tests\Feature;

use App\Enums\ClaimStatus;
use App\Enums\UserRole;
use App\Models\Claim;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ClaimWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (UserRole::cases() as $role) {
            Role::firstOrCreate([
                'name' => $role->value,
                'guard_name' => 'web',
            ]);
        }
    }

    public function test_user_can_login_successfully(): void
    {
        $user = $this->createUserWithRole(UserRole::User);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Login successful.')
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'token',
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'roles',
                    ],
                ],
            ]);
    }

    public function test_user_can_create_claim_as_draft(): void
    {
        $user = $this->createUserWithRole(UserRole::User);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/claims', [
            'title' => 'Klaim Rawat Inap',
            'description' => 'Klaim biaya rawat inap selama 3 hari.',
            'amount' => 2500000,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Claim created successfully.')
            ->assertJsonPath('data.status', ClaimStatus::Draft->value);

        $this->assertDatabaseHas('claims', [
            'user_id' => $user->id,
            'title' => 'Klaim Rawat Inap',
            'status' => ClaimStatus::Draft->value,
        ]);

        $this->assertDatabaseHas('claim_activity_logs', [
            'actor_id' => $user->id,
            'new_status' => ClaimStatus::Draft->value,
            'action' => 'create_claim',
        ]);
    }

    public function test_complete_claim_workflow_until_approved(): void
    {
        $user = $this->createUserWithRole(UserRole::User);
        $verifier = $this->createUserWithRole(UserRole::Verifier);
        $approver = $this->createUserWithRole(UserRole::Approver);

        Sanctum::actingAs($user);

        $createResponse = $this->postJson('/api/claims', [
            'title' => 'Klaim Operasi',
            'description' => 'Klaim biaya tindakan operasi.',
            'amount' => 5000000,
        ]);

        $claimId = $createResponse->json('data.id');

        $this->postJson("/api/claims/{$claimId}/submit", [
            'notes' => 'Data klaim sudah lengkap.',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', ClaimStatus::Submitted->value);

        Sanctum::actingAs($verifier);

        $this->postJson("/api/claims/{$claimId}/review", [
            'notes' => 'Dokumen valid.',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', ClaimStatus::Reviewed->value);

        Sanctum::actingAs($approver);

        $this->postJson("/api/claims/{$claimId}/approve", [
            'notes' => 'Klaim disetujui.',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', ClaimStatus::Approved->value);

        $this->assertDatabaseHas('claims', [
            'id' => $claimId,
            'status' => ClaimStatus::Approved->value,
        ]);

        $this->assertDatabaseHas('claim_activity_logs', [
            'claim_id' => $claimId,
            'old_status' => ClaimStatus::Reviewed->value,
            'new_status' => ClaimStatus::Approved->value,
            'action' => 'approve_claim',
        ]);
    }

    public function test_user_cannot_review_claim(): void
    {
        $user = $this->createUserWithRole(UserRole::User);

        $claim = $this->createClaimForUser($user, ClaimStatus::Submitted);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/claims/{$claim->id}/review", [
            'notes' => 'User mencoba review.',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonPath('success', false);

        $this->assertDatabaseHas('claims', [
            'id' => $claim->id,
            'status' => ClaimStatus::Submitted->value,
        ]);
    }

    public function test_verifier_cannot_approve_claim(): void
    {
        $user = $this->createUserWithRole(UserRole::User);
        $verifier = $this->createUserWithRole(UserRole::Verifier);

        $claim = $this->createClaimForUser($user, ClaimStatus::Reviewed);

        Sanctum::actingAs($verifier);

        $response = $this->postJson("/api/claims/{$claim->id}/approve", [
            'notes' => 'Verifier mencoba approve.',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonPath('success', false);

        $this->assertDatabaseHas('claims', [
            'id' => $claim->id,
            'status' => ClaimStatus::Reviewed->value,
        ]);
    }

    public function test_status_cannot_skip_from_draft_to_approved(): void
    {
        $user = $this->createUserWithRole(UserRole::User);
        $approver = $this->createUserWithRole(UserRole::Approver);

        $claim = $this->createClaimForUser($user, ClaimStatus::Draft);

        Sanctum::actingAs($approver);

        $response = $this->postJson("/api/claims/{$claim->id}/approve", [
            'notes' => 'Approver mencoba langsung approve dari draft.',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonPath('success', false);

        $this->assertDatabaseHas('claims', [
            'id' => $claim->id,
            'status' => ClaimStatus::Draft->value,
        ]);
    }

    public function test_approver_can_reject_reviewed_claim(): void
    {
        $user = $this->createUserWithRole(UserRole::User);
        $approver = $this->createUserWithRole(UserRole::Approver);

        $claim = $this->createClaimForUser($user, ClaimStatus::Reviewed);

        Sanctum::actingAs($approver);

        $response = $this->postJson("/api/claims/{$claim->id}/reject", [
            'notes' => 'Klaim ditolak karena dokumen tidak sesuai.',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', ClaimStatus::Rejected->value);

        $this->assertDatabaseHas('claims', [
            'id' => $claim->id,
            'status' => ClaimStatus::Rejected->value,
        ]);

        $this->assertDatabaseHas('claim_activity_logs', [
            'claim_id' => $claim->id,
            'old_status' => ClaimStatus::Reviewed->value,
            'new_status' => ClaimStatus::Rejected->value,
            'action' => 'reject_claim',
        ]);
    }

    private function createUserWithRole(UserRole $role): User
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $user->assignRole($role->value);

        return $user;
    }

    private function createClaimForUser(User $user, ClaimStatus $status): Claim
    {
        return Claim::create([
            'claim_number' => 'CLM-TEST-' . fake()->unique()->numerify('######'),
            'user_id' => $user->id,
            'title' => 'Test Claim',
            'description' => 'Test claim description.',
            'amount' => 1000000,
            'status' => $status,
        ]);
    }
}