import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { createClaim } from "@/services/claimService"
import type { CreateClaimPayload } from "@/types/claim"

export function useCreateClaim() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: CreateClaimPayload) => createClaim(payload),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["claims"] })
      navigate(`/claims/${response.data.id}`)
    },
  })

  return {
    isError: mutation.isError,
    handleCreateClaim: async (payload: CreateClaimPayload): Promise<void> => {
      await mutation.mutateAsync(payload)
    },
  }
}
