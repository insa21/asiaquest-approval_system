import { Outlet } from "react-router-dom"
import { AppHeader } from "@/fragments/layout/AppHeader"
import { SidebarNav } from "@/fragments/layout/SidebarNav"

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AppHeader />

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[240px_1fr]">
        <SidebarNav />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
