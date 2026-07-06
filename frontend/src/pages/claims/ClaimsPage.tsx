import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ErrorState } from "@/elements/ErrorState"
import { LoadingState } from "@/elements/LoadingState"
import { PageHeader } from "@/elements/PageHeader"
import { ClaimTable } from "@/fragments/claims/ClaimTable"
import { getClaims } from "@/services/claimService"
import { useAuthStore } from "@/stores/authStore"

export function ClaimsPage() {
  const role = useAuthStore((s) => s.user)?.roles[0]

  const { data, isLoading, isError } = useQuery({
    queryKey: ["claims"],
    queryFn: () => getClaims(10),
  })

  const headerAction =
    role === "user" ? (
      <Button asChild>
        <Link to="/claims/create">Buat Claim</Link>
      </Button>
    ) : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        title="Claims"
        description="Daftar klaim yang dapat diakses sesuai role Anda."
        action={headerAction}
      />

      {isLoading && <LoadingState message="Memuat daftar claim..." />}
      {isError && <ErrorState />}
      {data && <ClaimTable claims={data.data} />}
    </div>
  )
}
