import { ArrowRight, CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores/authStore"
import type { UserRole } from "@/types/auth"

const ROLE_DESCRIPTION: Record<NonNullable<UserRole>, string> = {
  user: "Anda dapat membuat klaim baru dan mengirim klaim draft.",
  verifier: "Anda dapat melihat klaim submitted dan melakukan review.",
  approver: "Anda dapat melihat klaim reviewed lalu approve atau reject.",
}

export function DashboardSummary() {
  const role = useAuthStore((s) => s.user)?.roles[0]
  const roleDescription = role
    ? ROLE_DESCRIPTION[role]
    : "Tidak ada deskripsi untuk role ini."

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-100">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            Role Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 leading-relaxed">{roleDescription}</p>
        </CardContent>
      </Card>

      <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-100">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
              <ClipboardList className="h-5 w-5" />
            </span>
            Claim Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-slate-400 leading-relaxed">Alur transisi klaim:</p>
          <div className="flex items-center flex-wrap gap-1 text-[11px] font-semibold text-indigo-300 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/50">
            <span className="text-slate-400">draft</span>
            <span className="text-slate-600">→</span>
            <span>submitted</span>
            <span className="text-slate-600">→</span>
            <span>reviewed</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-400">approved</span>
            <span className="text-slate-600">/</span>
            <span className="text-rose-400">rejected</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-100">
            <span className="p-2 rounded-lg bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 group-hover:text-pink-300 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.05)]">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            Quick Action
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <Button asChild className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer rounded-lg border-0">
            <Link to="/claims" className="flex items-center justify-center gap-2">
              Open Claims
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
