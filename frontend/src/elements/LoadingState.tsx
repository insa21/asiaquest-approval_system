import { Loader2 } from "lucide-react"

interface LoadingStateProps {
  message?: string
}

export function LoadingState({
  message = "Memuat data...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        {message}
      </div>
    </div>
  )
}
