"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ServerActionIconName = "trash";

type ServerActionButtonFormProps = {
  action: (formData: FormData) => Promise<void>;
  buttonClassName: string;
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  refreshOnSuccess?: boolean;
  buttonLabel?: string;
  iconName?: ServerActionIconName;
};

const iconMap = {
  trash: Trash2,
} satisfies Record<ServerActionIconName, React.ComponentType<{ className?: string }>>;

export function ServerActionButtonForm({
  action,
  buttonClassName,
  children,
  pendingLabel,
  className,
  refreshOnSuccess = true,
  buttonLabel,
  iconName,
}: ServerActionButtonFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const Icon = iconName ? iconMap[iconName] : null;

  async function formAction(formData: FormData) {
    setPending(true);

    try {
      await action(formData);
      if (refreshOnSuccess) {
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={formAction} className={className}>
      {children}
      <button
        type="submit"
        disabled={pending}
        aria-label={buttonLabel}
        title={buttonLabel}
        className={`${buttonClassName} transition-all duration-200 ${pending ? "scale-[0.98] animate-pulse opacity-80" : ""}`}
      >
        <span className="inline-flex items-center gap-2">
          {pending ? <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" /> : null}
          {pending ? pendingLabel : Icon ? <Icon className="h-4 w-4" /> : "Excluir"}
        </span>
      </button>
    </form>
  );
}
