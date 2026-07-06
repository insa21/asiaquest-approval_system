<?php

namespace App\Http\Controllers\Api;

use App\DTOs\CreateClaimData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChangeClaimStatusRequest;
use App\Http\Requests\StoreClaimRequest;
use App\Http\Resources\ClaimResource;
use App\Models\Claim;
use App\Services\Claim\ClaimService;
use App\Services\Claim\ClaimWorkflowService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClaimController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ClaimService $claimService,
        private readonly ClaimWorkflowService $workflowService,
    ) {}



    /**
     * List claims
     *
     * Menampilkan daftar klaim berdasarkan role user yang sedang login.
     *
     * User hanya melihat klaim miliknya sendiri.
     * Verifier hanya melihat klaim berstatus submitted.
     * Approver hanya melihat klaim berstatus reviewed.
     *
     * @group Claims
     * @authenticated
     *
     * @queryParam per_page integer Jumlah data per halaman. Example: 10
     */
        public function index(Request $request): JsonResponse
    {
        $claims = $this->claimService->paginateVisibleFor(
            user: $request->user(),
            perPage: (int) $request->query('per_page', 10)
        );

        return $this->paginated(
            paginator: $claims,
            resourceClass: ClaimResource::class,
            message: 'Claims retrieved successfully.'
        );
    }

    /**
     * Create claim
     *
     * Membuat klaim baru dengan status draft.
     *
     * @group Claims
     * @authenticated
     *
     * @bodyParam title string required Judul klaim. Example: Klaim Rawat Inap
     * @bodyParam description string Deskripsi klaim. Example: Klaim biaya rawat inap selama 3 hari.
     * @bodyParam amount number required Nominal klaim. Example: 2500000
     */
    public function store(StoreClaimRequest $request): JsonResponse
    {
        $claim = $this->claimService->create(
            data: CreateClaimData::fromRequest($request),
            user: $request->user()
        );

        return $this->success(
            data: new ClaimResource($claim),
            message: 'Claim created successfully.',
            status: 201
        );
    }

    
    /**
     * Show claim detail
     *
     * Menampilkan detail klaim beserta activity log.
     *
     * @group Claims
     * @authenticated
     *
     * @urlParam claim integer required ID klaim. Example: 1
     */
    public function show(Request $request, Claim $claim): JsonResponse
    {
        $claim = $this->claimService->findVisibleById(
            user: $request->user(),
            claimId: $claim->id
        );

        return $this->success(
            data: new ClaimResource($claim),
            message: 'Claim detail retrieved successfully.'
        );
    }


    /**
     * Submit claim
     *
     * Mengubah status klaim dari draft menjadi submitted.
     *
     * @group Claim Workflow
     * @authenticated
     *
     * @urlParam claim integer required ID klaim. Example: 1
     * @bodyParam notes string Catatan perubahan status. Example: Data klaim sudah lengkap.
     */
    public function submit(ChangeClaimStatusRequest $request, Claim $claim): JsonResponse
    {
        $claim = $this->workflowService->submit(
            claimId: $claim->id,
            actor: $request->user(),
            notes: $request->validated('notes')
        );

        return $this->success(
            data: new ClaimResource($claim),
            message: 'Claim submitted successfully.'
        );
    }

    /**
     * Review claim
     *
     * Mengubah status klaim dari submitted menjadi reviewed.
     *
     * @group Claim Workflow
     * @authenticated
     *
     * @urlParam claim integer required ID klaim. Example: 1
     * @bodyParam notes string Catatan perubahan status. Example: Dokumen perlu diperjelas.
     */
    public function review(ChangeClaimStatusRequest $request, Claim $claim): JsonResponse
    {
        $claim = $this->workflowService->review(
            claimId: $claim->id,
            actor: $request->user(),
            notes: $request->validated('notes')
        );

        return $this->success(
            data: new ClaimResource($claim),
            message: 'Claim reviewed successfully.'
        );
    }

    /**
     * Approve claim
     *
     * Mengubah status klaim dari reviewed menjadi approved.
     *
     * @group Claim Workflow
     * @authenticated
     *
     * @urlParam claim integer required ID klaim. Example: 1
     * @bodyParam notes string Catatan approver. Example: Klaim disetujui.
     */
    public function approve(ChangeClaimStatusRequest $request, Claim $claim): JsonResponse
    {
        $claim = $this->workflowService->approve(
            claimId: $claim->id,
            actor: $request->user(),
            notes: $request->validated('notes')
        );

        return $this->success(
            data: new ClaimResource($claim),
            message: 'Claim approved successfully.'
        );
    }

    
    /**
     * Reject claim
     *
     * Mengubah status klaim dari reviewed menjadi rejected.
     *
     * @group Claim Workflow
     * @authenticated
     *
     * @urlParam claim integer required ID klaim. Example: 1
     * @bodyParam notes string Catatan approver. Example: Klaim ditolak karena dokumen tidak sesuai.
     */
    public function reject(ChangeClaimStatusRequest $request, Claim $claim): JsonResponse
    {
        $claim = $this->workflowService->reject(
            claimId: $claim->id,
            actor: $request->user(),
            notes: $request->validated('notes')
        );

        return $this->success(
            data: new ClaimResource($claim),
            message: 'Claim rejected successfully.'
        );
    }
}