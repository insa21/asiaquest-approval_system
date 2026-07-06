import { useEffect } from "react"
import { AppRoutes } from "@/routes/AppRoutes"
import { useAuthStore } from "@/stores/authStore"

export default function App() {
  const setAuthFromStorage = useAuthStore((s) => s.setAuthFromStorage)

  useEffect(() => {
    setAuthFromStorage()
  }, [setAuthFromStorage])

  return <AppRoutes />
}
