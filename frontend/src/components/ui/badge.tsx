import * as React from "react"
import { cn } from "@/lib/utils"
type BadgeProps = React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "outline" }
const variants = { default: "border-transparent bg-white text-slate-950", secondary: "border-transparent bg-slate-800 text-slate-200", outline: "border-slate-700 text-slate-200" }
export function Badge({ className, variant = "default", ...props }: BadgeProps) { return <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)} {...props} /> }
