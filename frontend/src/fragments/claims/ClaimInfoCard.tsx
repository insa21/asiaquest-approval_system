import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/elements/StatusBadge"
import { formatCurrency, formatDateTime } from "@/lib/formatters"
import type { Claim } from "@/types/claim"

interface ClaimInfoCardProps {
  claim: Claim
}

export function ClaimInfoCard({ claim }: ClaimInfoCardProps) {
  return (
    <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
      <CardHeader className="border-b border-slate-800/60 pb-4">
        <CardTitle className="flex items-center justify-between gap-3 text-base font-semibold text-slate-100">
          <span>Claim Information</span>
          <StatusBadge status={claim.status} />
        </CardTitle>
      </CardHeader>

      <CardContent className="divide-y divide-slate-800/50 text-sm">
        <div className="py-4 flex justify-between items-center gap-4">
          <span className="text-slate-400 font-medium">Pemilik</span>
          <span className="font-semibold text-slate-200">{claim.user.name}</span>
        </div>

        <div className="py-4 flex justify-between items-center gap-4">
          <span className="text-slate-400 font-medium">Nominal</span>
          <span className="font-bold text-indigo-400 text-base">{formatCurrency(claim.amount)}</span>
        </div>

        <div className="py-4 space-y-1.5">
          <p className="text-slate-400 font-medium">Deskripsi</p>
          <p className="text-slate-300 leading-relaxed bg-slate-950/30 p-3 rounded-lg border border-slate-800/40 font-medium">
            {claim.description ?? "Tidak ada deskripsi."}
          </p>
        </div>

        <div className="py-4 flex justify-between items-center gap-4">
          <span className="text-slate-400 font-medium">Dibuat Pada</span>
          <span className="text-slate-300 font-medium">{formatDateTime(claim.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
