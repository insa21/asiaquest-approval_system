import { Navigate } from "react-router-dom"
import { LoginForm } from "@/fragments/auth/LoginForm"
import { useAuthStore } from "@/stores/authStore"

export function LoginPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <LoginForm />
    </main>
  )
}
