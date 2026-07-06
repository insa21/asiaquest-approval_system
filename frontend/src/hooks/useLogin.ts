import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"
import type { LoginPayload } from "@/types/auth"

export function useLogin() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [error, setError] = useState("")

  async function handleLogin(payload: LoginPayload) {
    setError("")
    try {
      await login(payload)
      navigate("/dashboard")
    } catch {
      setError("Login gagal. Silakan periksa kembali email dan password Anda.")
    }
  }

  return { error, handleLogin }
}
