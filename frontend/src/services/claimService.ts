import { api } from "@/services/api"
import type {
  ApiResponse,
  Claim,
  CreateClaimPayload,
  PaginatedResponse,
  WorkflowPayload,
} from "@/types/claim"

export async function getClaims(
  perPage = 10,
): Promise<PaginatedResponse<Claim>> {
  const response = await api.get<PaginatedResponse<Claim>>("/claims", {
    params: { per_page: perPage },
  })
  return response.data
}

export async function getClaim(id: number): Promise<ApiResponse<Claim>> {
  const response = await api.get<ApiResponse<Claim>>(`/claims/${id}`)
  return response.data
}

export async function createClaim(
  payload: CreateClaimPayload,
): Promise<ApiResponse<Claim>> {
  const response = await api.post<ApiResponse<Claim>>("/claims", payload)
  return response.data
}

export async function submitClaim(
  id: number,
  payload: WorkflowPayload,
): Promise<ApiResponse<Claim>> {
  const response = await api.post<ApiResponse<Claim>>(
    `/claims/${id}/submit`,
    payload,
  )
  return response.data
}

export async function reviewClaim(
  id: number,
  payload: WorkflowPayload,
): Promise<ApiResponse<Claim>> {
  const response = await api.post<ApiResponse<Claim>>(
    `/claims/${id}/review`,
    payload,
  )
  return response.data
}

export async function approveClaim(
  id: number,
  payload: WorkflowPayload,
): Promise<ApiResponse<Claim>> {
  const response = await api.post<ApiResponse<Claim>>(
    `/claims/${id}/approve`,
    payload,
  )
  return response.data
}

export async function rejectClaim(
  id: number,
  payload: WorkflowPayload,
): Promise<ApiResponse<Claim>> {
  const response = await api.post<ApiResponse<Claim>>(
    `/claims/${id}/reject`,
    payload,
  )
  return response.data
}
