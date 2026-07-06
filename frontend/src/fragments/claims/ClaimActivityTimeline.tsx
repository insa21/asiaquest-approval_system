import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/elements/EmptyState"
import { StatusBadge } from "@/elements/StatusBadge"
import { formatDateTime } from "@/lib/formatters"
import type { ClaimActivityLog } from "@/types/claim"

interface ClaimActivityTimelineProps {
  logs?: ClaimActivityLog[]
}

export function ClaimActivityTimeline({
  logs = [],
}: ClaimActivityTimelineProps) {
  return (
    <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-100">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Clock className="h-4.5 w-4.5" />
          </span>
          Activity Log
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-6">
        {!logs.length ? (
          <EmptyState
            title="Belum ada aktivitas"
            description="Aktivitas claim akan muncul di sini."
          />
        ) : (
          <div className="relative pl-6 border-l-2 border-slate-800/80 ml-2 space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 border border-slate-800 group-hover:border-indigo-500/60 transition-colors duration-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors duration-300" />
                </span>

                <div className="bg-slate-950/40 border border-slate-850/60 rounded-xl p-4 shadow-sm hover:border-slate-800 transition-all duration-300">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {log.old_status && (
                      <>
                        <StatusBadge status={log.old_status} />
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">to</span>
                      </>
                    )}
                    <StatusBadge status={log.new_status} />
                  </div>

                  <p className="mt-2.5 text-sm text-slate-300 leading-relaxed font-medium">
                    {log.notes ?? log.action}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900/60 pt-2.5">
                    <span className="font-semibold text-slate-400">
                      By {log.actor?.name ?? "-"}
                    </span>
                    <span>
                      {formatDateTime(log.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
