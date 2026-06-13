export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="space-y-3">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
    </header>
  );
}
