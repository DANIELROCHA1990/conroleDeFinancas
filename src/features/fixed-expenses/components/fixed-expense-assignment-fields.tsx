"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/form-field";

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
      <FormField label="Responsabilidade" hint="Defina se a conta pertence a uma pessoa ou a todos.">
        <select
          name="assignment_mode"
          value={assignmentMode}
          onChange={(event) => setAssignmentMode(event.target.value as "single" | "all")}
          className="app-input"
          required
        >
          <option value="single">Responsavel individual</option>
          {canSplitAcrossAll ? <option value="all">Todos os responsaveis</option> : null}
        </select>
      </FormField>
      <FormField label="Responsavel" hint="Campo usado apenas quando a conta pertence a uma pessoa.">
        <select
          name="assignee_id"
          defaultValue={defaultAssigneeId ?? activeAssignees[0]?.id ?? ""}
          disabled={assignmentMode === "all"}
          aria-disabled={assignmentMode === "all"}
          className="app-input"
          required={assignmentMode === "single"}
        >
          {activeAssignees.map((assignee) => (
            <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
          ))}
        </select>
      </FormField>
    </>
  );
}
