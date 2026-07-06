import { ErrorState } from "@/elements/ErrorState"
import { PageHeader } from "@/elements/PageHeader"
import { ClaimForm } from "@/fragments/claims/ClaimForm"
import { useCreateClaim } from "@/hooks/useCreateClaim"

export function CreateClaimPage() {
  const { isError, handleCreateClaim } = useCreateClaim()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Claim"
        description="Buat klaim baru. Status awal klaim akan menjadi draft."
      />

      {isError && (
        <ErrorState message="Gagal membuat klaim. Silakan periksa kembali input Anda dan coba lagi." />
      )}

      <ClaimForm onSubmit={handleCreateClaim} />
    </div>
  )
}
