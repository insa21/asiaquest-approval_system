import type { ComponentProps, ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface AppButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean
  icon?: ReactNode
}

export function AppButton({
  children,
  loading = false,
  disabled,
  icon,
  className,
  ...props
}: AppButtonProps) {
  return (
    <Button disabled={disabled || loading} className={className} {...props}>
      {loading && (
        <svg
          aria-hidden="true"
          className="mr-2 h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && (
        <span className="mr-1.5 flex items-center">{icon}</span>
      )}
      {children}
    </Button>
  )
}
