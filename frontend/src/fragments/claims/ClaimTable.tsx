import { Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { AppButton } from "@/elements"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/elements/EmptyState"
import { StatusBadge } from "@/elements/StatusBadge"
import { formatCurrency, formatDateTime } from "@/lib/formatters"
import type { Claim } from "@/types/claim"

interface ClaimTableProps {
  claims: Claim[]
}

export function ClaimTable({ claims }: ClaimTableProps) {
  if (!claims.length) {
    return (
      <EmptyState
        title="Belum ada claim"
        description="Data claim yang sesuai dengan role Anda belum tersedia."
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
      <Table>
        <TableHeader className="bg-slate-950/60 border-b border-slate-800/60">
          <TableRow className="border-b-0 hover:bg-transparent">
            <TableHead className="py-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Nomor</TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Judul</TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Pemilik</TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Nominal</TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Status</TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Tanggal</TableHead>
            <TableHead className="py-4 text-xs font-bold tracking-wider text-slate-400 uppercase text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-all duration-300">
              <TableCell className="py-4 font-semibold text-slate-200">
                {claim.claim_number}
              </TableCell>
              <TableCell className="py-4 text-slate-300 font-medium">{claim.title}</TableCell>
              <TableCell className="py-4 text-slate-400">
                {claim.user?.name ?? "-"}
              </TableCell>
              <TableCell className="py-4 font-semibold text-indigo-300">
                {formatCurrency(claim.amount)}
              </TableCell>
              <TableCell className="py-4">
                <StatusBadge status={claim.status} />
              </TableCell>
              <TableCell className="py-4 text-slate-400 text-xs">
                {formatDateTime(claim.created_at)}
              </TableCell>
              <TableCell className="py-4 text-right">
                <AppButton asChild size="sm" variant="outline" className="border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 active:scale-95 transition-all duration-200">
                  <Link to={`/claims/${claim.id}`}>
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Detail
                  </Link>
                </AppButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
