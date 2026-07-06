import { create } from "zustand"
import { api } from "@/services/api"
import type { AuthUser, LoginPayload, LoginResponse } from "@/types/auth"

type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  setAuthFromStorage: () => void
}

function getStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem("auth_user")
  if (!rawUser) return null

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    localStorage.removeItem("auth_user")
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem("access_token"),
  isAuthenticated: Boolean(
    localStorage.getItem("access_token") && getStoredUser(),
  ),

  login: async (payload) => {
    const response = await api.post<LoginResponse>("/login", payload)
    const { token, user } = response.data.data
    localStorage.setItem("access_token", token)
    localStorage.setItem("auth_user", JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  logout: async () => {
    try {
      await api.post("/logout")
    } finally {
      localStorage.removeItem("access_token")
      localStorage.removeItem("auth_user")
      set({ user: null, token: null, isAuthenticated: false })
    }
  },

  setAuthFromStorage: () => {
    const token = localStorage.getItem("access_token")
    const user = getStoredUser()
    set({ token, user, isAuthenticated: Boolean(token && user) })
  },
}))
