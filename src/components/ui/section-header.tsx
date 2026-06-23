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
    <header className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--accent-strong)]">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[color:var(--text-main)] sm:text-4xl">{title}</h1>
      <p className="max-w-3xl text-sm leading-7 text-[color:var(--text-muted)] sm:text-[0.96rem]">{description}</p>
    </header>
  );
}
