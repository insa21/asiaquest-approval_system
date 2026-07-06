import { Badge } from "@/components/ui/badge"
import type { ClaimStatus } from "@/types/claim"

const STATUS_LABEL: Record<ClaimStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  reviewed: "Reviewed",
  approved: "Approved",
  rejected: "Rejected",
}

const STATUS_CLASS: Record<ClaimStatus, string> = {
  draft: "border-slate-700 bg-slate-800/40 text-slate-300 shadow-[0_0_12px_rgba(148,163,184,0.05)]",
  submitted: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.08)]",
  reviewed: "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.08)]",
  approved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.08)]",
  rejected: "border-rose-500/30 bg-rose-500/10 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.08)]",
}

const DOT_CLASS: Record<ClaimStatus, string> = {
  draft: "bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]",
  submitted: "bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]",
  reviewed: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
  approved: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
  rejected: "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]",
}

interface StatusBadgeProps {
  status: ClaimStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`${STATUS_CLASS[status]} flex w-fit items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border transition-all duration-300 hover:brightness-110`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[status]}`} />
      {STATUS_LABEL[status]}
    </Badge>
  )
}
