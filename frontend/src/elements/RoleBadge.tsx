import { Badge } from "@/components/ui/badge"
import type { UserRole } from "@/types/auth"

interface RoleBadgeProps {
  role?: UserRole
}

const ROLE_CLASS: Record<UserRole, string> = {
  user: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  verifier: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  approver: "border-amber-500/20 bg-amber-500/10 text-amber-300",
}

export function RoleBadge({ role }: RoleBadgeProps) {
  if (!role) return null

  return (
    <Badge
      variant="outline"
      className={`${ROLE_CLASS[role]} capitalize text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border transition-all duration-300`}
    >
      {role}
    </Badge>
  )
}
