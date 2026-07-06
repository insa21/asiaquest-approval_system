import * as React from "react"
import { cn } from "@/lib/utils"
type Variant = "default" | "outline" | "secondary" | "destructive" | "ghost"
type Size = "default" | "sm" | "lg"
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; asChild?: boolean }
const variants: Record<Variant, string> = { default: "bg-white text-slate-950 hover:bg-slate-200", outline: "border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800", secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700", destructive: "bg-red-600 text-white hover:bg-red-700", ghost: "bg-transparent text-slate-100 hover:bg-slate-800" }
const sizes: Record<Size, string> = { default: "h-10 px-4 py-2", sm: "h-9 px-3", lg: "h-11 px-6" }
export const Button = React.forwardRef<HTMLButtonElement, Props>(({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
  const base = cn("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)
  if (asChild && React.isValidElement(children)) return React.cloneElement(children as React.ReactElement<any>, { className: cn(base, (children.props as {className?: string}).className) })
  return <button ref={ref} className={base} {...props}>{children}</button>
})
Button.displayName = "Button"
