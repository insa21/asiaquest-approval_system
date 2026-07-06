import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AppButton } from "@/elements"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin } from "@/hooks/useLogin"

const loginSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { error, handleLogin } = useLogin()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "user@example.com", password: "password" },
  })

  function fillDemoAccount(email: string) {
    setValue("email", email)
    setValue("password", "password")
  }

  return (
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl p-4 rounded-2xl relative overflow-hidden group">
      {/* Background glow orb */}
      <span className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/15 transition-all duration-500" />
      
      <CardHeader className="text-center pb-5 pt-3">
        <CardTitle className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Approval System
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs font-medium mt-1">
          Sign in to access your claims or verify requests
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Email Address</Label>
            <Input 
              {...register("email")} 
              placeholder="user@example.com" 
              className="border-slate-800 bg-slate-950/60 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-lg py-2.5 text-slate-100 transition-all duration-300"
            />
            {errors.email && (
              <p className="text-xs text-rose-400 font-semibold mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 font-semibold text-xs uppercase tracking-wider">Password</Label>
            <Input
              {...register("password")}
              placeholder="password"
              type="password"
              className="border-slate-800 bg-slate-950/60 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-lg py-2.5 text-slate-100 transition-all duration-300"
            />
            {errors.password && (
              <p className="text-xs text-rose-400 font-semibold mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 font-semibold">
              {error}
            </p>
          )}

          <AppButton 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/10 transition-all duration-300 rounded-lg border-0 cursor-pointer text-sm font-semibold py-2.5 mt-2 transform active:scale-[0.98]" 
            loading={isSubmitting} 
            type="submit"
          >
            Sign In
          </AppButton>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800/80"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-wider">Or Quick Connect</span>
          <div className="flex-grow border-t border-slate-800/80"></div>
        </div>

        <div className="grid gap-2 text-xs">
          <AppButton
            type="button"
            variant="outline"
            className="border-slate-800/80 hover:bg-sky-500/10 hover:text-sky-300 hover:border-sky-500/30 transition-all duration-300 rounded-lg"
            onClick={() => fillDemoAccount("user@example.com")}
          >
            Use Demo User (Claimant)
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            className="border-slate-800/80 hover:bg-violet-500/10 hover:text-violet-300 hover:border-violet-500/30 transition-all duration-300 rounded-lg"
            onClick={() => fillDemoAccount("verifier@example.com")}
          >
            Use Demo Verifier (Finance)
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            className="border-slate-800/80 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/30 transition-all duration-300 rounded-lg"
            onClick={() => fillDemoAccount("approver@example.com")}
          >
            Use Demo Approver (Manager)
          </AppButton>
        </div>
      </CardContent>
    </Card>
  )
}
