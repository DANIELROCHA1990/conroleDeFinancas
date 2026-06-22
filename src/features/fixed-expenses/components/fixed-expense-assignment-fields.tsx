"use client";

import { useState } from "react";

type PaymentAssigneeOption = { id: string; name: string; active: boolean };

export function FixedExpenseAssignmentFields({
  assignees,
  defaultAssignmentMode,
  defaultAssigneeId,
}: {
  assignees: PaymentAssigneeOption[];
  defaultAssignmentMode: "single" | "all";
  defaultAssigneeId?: string | null;
}) {
  const activeAssignees = assignees.filter((item) => item.active);
  const canSplitAcrossAll = activeAssignees.length > 1;
  const [assignmentMode, setAssignmentMode] = useState<"single" | "all">(defaultAssignmentMode);

  return (
    <>
      <select
        name="assignment_mode"
        value={assignmentMode}
        onChange={(event) => setAssignmentMode(event.target.value as "single" | "all")}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        required
      >
        <option value="single">Atribuicao individual</option>
        {canSplitAcrossAll ? <option value="all">Todos</option> : null}
      </select>
      <select
        name="assignee_id"
        defaultValue={defaultAssigneeId ?? activeAssignees[0]?.id ?? ""}
        disabled={assignmentMode === "all"}
        aria-disabled={assignmentMode === "all"}
        className={`rounded-2xl border px-4 py-3 ${assignmentMode === "all" ? "cursor-not-allowed border-white/5 bg-slate-100/40 text-slate-400 opacity-60" : "border-white/10 bg-white/5"}`}
        required={assignmentMode === "single"}
      >
        {activeAssignees.map((assignee) => (
          <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
        ))}
      </select>
    </>
  );
}
