import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"

export function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
          AsiaQuest
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Claim Approval Workflow System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl border border-gray-100 sm:px-10 dark:bg-gray-900 dark:border-gray-800">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
