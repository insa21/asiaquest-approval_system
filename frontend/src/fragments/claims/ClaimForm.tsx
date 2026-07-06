import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AppButton } from "@/elements"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CreateClaimPayload } from "@/types/claim"

const claimSchema = z.object({
  title: z
    .string()
    .min(3, "Judul klaim minimal 3 karakter.")
    .max(150, "Judul klaim maksimal 150 karakter."),
  description: z
    .string()
    .max(1000, "Deskripsi klaim maksimal 1000 karakter.")
    .optional(),
  amount: z.number().min(1, "Nominal klaim wajib lebih dari 0."),
})

type ClaimFormValues = z.infer<typeof claimSchema>

interface ClaimFormProps {
  onSubmit: (payload: CreateClaimPayload) => Promise<void>
}

export function ClaimForm({ onSubmit }: ClaimFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: { title: "", description: "", amount: 0 },
  })

  async function handleFormSubmit(values: ClaimFormValues) {
    await onSubmit({
      title: values.title,
      description: values.description,
      amount: values.amount,
    })
  }

  return (
    <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-xl">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Judul Klaim</Label>
            <Input 
              {...register("title")} 
              placeholder="Klaim Rawat Inap" 
              className="border-slate-800 bg-slate-950/60 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-lg py-2.5 text-slate-100 transition-all duration-300"
            />
            {errors.title && (
              <p className="text-xs text-rose-400 font-semibold mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Deskripsi</Label>
            <Textarea
              {...register("description")}
              className="min-h-28 border-slate-800 bg-slate-950/60 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-lg text-slate-100 transition-all duration-300"
              placeholder="Masukkan deskripsi klaim..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Nominal (IDR)</Label>
            <Input
              {...register("amount", { valueAsNumber: true })}
              min={1}
              placeholder="2500000"
              type="number"
              className="border-slate-800 bg-slate-950/60 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-lg py-2.5 text-slate-100 transition-all duration-300"
            />
            {errors.amount && (
              <p className="text-xs text-rose-400 font-semibold mt-1">{errors.amount.message}</p>
            )}
          </div>

          <AppButton 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/10 transition-all duration-300 rounded-lg border-0 cursor-pointer text-sm font-semibold py-2.5 transform active:scale-[0.98]" 
            loading={isSubmitting} 
            type="submit"
          >
            Simpan Klaim
          </AppButton>
        </form>
      </CardContent>
    </Card>
  )
}
