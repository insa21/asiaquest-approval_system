import { LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { AppButton } from "@/elements"
import { RoleBadge } from "@/elements/RoleBadge"
import { useAuthStore } from "@/stores/authStore"

export function AppHeader() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const role = user?.roles[0]

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/dashboard" className="group">
          <h1 className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 group-hover:brightness-110 transition-all duration-300">
            Approval System
          </h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium hover:text-slate-300 transition-colors">{user?.name}</span>
            <RoleBadge role={role} />
          </div>
        </Link>

        <AppButton
          variant="outline"
          onClick={handleLogout}
          icon={<LogOut className="h-4 w-4" />}
          className="border-slate-800 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/50 transition-all duration-300 rounded-lg active:scale-95"
        >
          Logout
        </AppButton>
      </div>
    </header>
  )
}
