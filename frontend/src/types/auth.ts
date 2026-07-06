export type UserRole = "user" | "verifier" | "approver"

export type AuthUser = {
  id: number
  name: string
  email: string
  roles: UserRole[]
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  success: boolean
  message: string
  data: {
    token: string
    user: AuthUser
  }
}
