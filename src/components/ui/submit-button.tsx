"use client";

import { ArrowRightLeft, Check, UserRoundCog } from "lucide-react";
import { useFormStatus } from "react-dom";

type SubmitButtonIconName = "check" | "user-round-cog" | "arrow-right-left";

const iconMap = {
  "arrow-right-left": ArrowRightLeft,
  check: Check,
  "user-round-cog": UserRoundCog,
} satisfies Record<SubmitButtonIconName, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>>;

export function SubmitButton({
  children,
  pendingLabel,
  className,
  iconName,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  iconName?: SubmitButtonIconName;
}) {
  const { pending } = useFormStatus();
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <button className={className} type="submit" disabled={pending}>
      <span className="inline-flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
        {pending ? pendingLabel : children}
      </span>
    </button>
  );
}
