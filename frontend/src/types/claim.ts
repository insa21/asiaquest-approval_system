export type ClaimStatus =
  | "draft"
  | "submitted"
  | "reviewed"
  | "approved"
  | "rejected"

export type ClaimUser = {
  id: number
  name: string
  email: string
}

export type ClaimActivityLog = {
  id: number
  old_status: ClaimStatus | null
  new_status: ClaimStatus
  action: string
  notes: string | null
  actor: ClaimUser
  created_at: string
}

export type Claim = {
  id: number
  claim_number: string
  title: string
  description: string | null
  amount: string
  status: ClaimStatus
  user: ClaimUser
  logs?: ClaimActivityLog[]
  created_at: string
  updated_at: string
}

export type CreateClaimPayload = {
  title: string
  description?: string
  amount: number
}

export type WorkflowPayload = {
  notes?: string
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type PaginatedResponse<T> = {
  success: boolean
  message: string
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
