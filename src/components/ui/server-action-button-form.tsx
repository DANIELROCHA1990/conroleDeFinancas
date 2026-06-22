"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ServerActionButtonFormProps = {
  action: (formData: FormData) => Promise<void>;
  buttonClassName: string;
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  refreshOnSuccess?: boolean;
};

export function ServerActionButtonForm({
  action,
  buttonClassName,
  children,
  pendingLabel,
  className,
  refreshOnSuccess = true,
}: ServerActionButtonFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

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
        className={`${buttonClassName} transition-all duration-200 ${pending ? "scale-[0.98] animate-pulse opacity-80" : ""}`}
      >
        <span className="inline-flex items-center gap-2">
          {pending ? <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" /> : null}
          {pending ? pendingLabel : "Excluir"}
        </span>
      </button>
    </form>
  );
}
