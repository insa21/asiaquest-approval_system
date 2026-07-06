import { ClipboardList, Home, PlusCircle } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "inline-flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 transform active:scale-98",
    isActive
      ? "bg-slate-800 text-indigo-400 border border-slate-700/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_12px_rgba(99,102,241,0.05)]"
      : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent hover:border-slate-800/60",
  ].join(" ")
}

export function SidebarNav() {
  const role = useAuthStore((s) => s.user)?.roles[0]

  return (
    <aside className="h-fit rounded-xl border border-slate-800 bg-slate-900 p-3">
      <nav className="flex flex-col gap-1">
        <NavLink className={navLinkClass} to="/dashboard">
          <Home className="h-4 w-4" />
          Dashboard
        </NavLink>

        <NavLink className={navLinkClass} to="/claims">
          <ClipboardList className="h-4 w-4" />
          Claims
        </NavLink>

        {role === "user" && (
          <NavLink className={navLinkClass} to="/claims/create">
            <PlusCircle className="h-4 w-4" />
            Create Claim
          </NavLink>
        )}
      </nav>
    </aside>
  )
}
