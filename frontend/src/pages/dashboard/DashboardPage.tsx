import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/elements/PageHeader"
import { DashboardSummary } from "@/fragments/dashboard/DashboardSummary"
import { useAuthStore } from "@/stores/authStore"

export function DashboardPage() {
  const role = useAuthStore((s) => s.user)?.roles[0]

  const headerAction =
    role === "user" ? (
      <Button asChild>
        <Link to="/claims/create">Buat Claim</Link>
      </Button>
    ) : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Kelola proses klaim berdasarkan role yang sedang login."
        action={headerAction}
      />
      <DashboardSummary />
    </div>
  )
}
