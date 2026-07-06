import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CheckCircle2, Send, ShieldCheck, XCircle } from "lucide-react"
import { useState } from "react"
import { AppButton } from "@/elements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  approveClaim,
  rejectClaim,
  reviewClaim,
  submitClaim,
} from "@/services/claimService"
import { useAuthStore } from "@/stores/authStore"
import type { Claim } from "@/types/claim"

type ClaimAction = "submit" | "review" | "approve" | "reject"

async function executeClaim(
  action: ClaimAction,
  claimId: number,
  notes: string,
) {
  const payload = { notes }
  if (action === "submit") return submitClaim(claimId, payload)
  if (action === "review") return reviewClaim(claimId, payload)
  if (action === "approve") return approveClaim(claimId, payload)
  return rejectClaim(claimId, payload)
}

interface ClaimActionPanelProps {
  claim: Claim
}

export function ClaimActionPanel({ claim }: ClaimActionPanelProps) {
  const queryClient = useQueryClient()
  const role = useAuthStore((s) => s.user)?.roles[0]
  const [notes, setNotes] = useState("")

  const mutation = useMutation({
    mutationFn: (action: ClaimAction) => executeClaim(action, claim.id, notes),
    onSuccess: async () => {
      setNotes("")
      await queryClient.invalidateQueries({ queryKey: ["claims"] })
      await queryClient.invalidateQueries({ queryKey: ["claim", claim.id] })
    },
  })

  const canSubmit = role === "user" && claim.status === "draft"
  const canReview = role === "verifier" && claim.status === "submitted"
  const canDecide = role === "approver" && claim.status === "reviewed"
  const hasAction = canSubmit || canReview || canDecide

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Available Action</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!hasAction ? (
          <p className="text-sm text-slate-400">
            Tidak ada aksi yang tersedia untuk role atau status claim saat ini.
          </p>
        ) : (
          <>
            <Textarea
              className="min-h-24"
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan..."
              value={notes}
            />

            {mutation.isError && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                Aksi gagal. Pastikan status claim dan role sudah sesuai.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {canSubmit && (
                <AppButton
                  loading={mutation.isPending}
                  onClick={() => mutation.mutate("submit")}
                  icon={<Send className="h-4 w-4" />}
                >
                  Submit Claim
                </AppButton>
              )}

              {canReview && (
                <AppButton
                  loading={mutation.isPending}
                  onClick={() => mutation.mutate("review")}
                  icon={<ShieldCheck className="h-4 w-4" />}
                >
                  Review Claim
                </AppButton>
              )}

              {canDecide && (
                <>
                  <AppButton
                    loading={mutation.isPending && mutation.variables === "approve"}
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate("approve")}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                  >
                    Approve
                  </AppButton>

                  <AppButton
                    loading={mutation.isPending && mutation.variables === "reject"}
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate("reject")}
                    variant="destructive"
                    icon={<XCircle className="h-4 w-4" />}
                  >
                    Reject
                  </AppButton>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
