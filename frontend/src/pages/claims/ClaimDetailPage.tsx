import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ErrorState } from "@/elements/ErrorState"
import { LoadingState } from "@/elements/LoadingState"
import { PageHeader } from "@/elements/PageHeader"
import { ClaimActionPanel } from "@/fragments/claims/ClaimActionPanel"
import { ClaimActivityTimeline } from "@/fragments/claims/ClaimActivityTimeline"
import { ClaimInfoCard } from "@/fragments/claims/ClaimInfoCard"
import { getClaim } from "@/services/claimService"

export function ClaimDetailPage() {
  const id = Number(useParams().id)
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["claim", id],
    queryFn: () => getClaim(id),
    enabled: Number.isFinite(id),
  })

  useEffect(() => {
    if (isError) {
      navigate("/claims", { replace: true })
    }
  }, [isError, navigate])

  if (isLoading) {
    return <LoadingState message="Memuat detail claim..." />
  }

  if (isError || !data) {
    return <ErrorState message="Detail claim tidak dapat dimuat." />
  }

  const claim = data.data

  return (
    <div className="space-y-6">
      <PageHeader
        title={claim.claim_number}
        description={claim.title}
        action={
          <Button asChild variant="outline">
            <Link to="/claims">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <ClaimInfoCard claim={claim} />
          <ClaimActivityTimeline logs={claim.logs} />
        </div>

        <ClaimActionPanel claim={claim} />
      </div>
    </div>
  )
}
