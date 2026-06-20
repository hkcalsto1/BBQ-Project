interface Props {
  title: string;
  subtitle?: string;
  selectedCount?: number;
}

export default function CategoryHeader({ title, subtitle, selectedCount }: Props) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-body text-xs uppercase tracking-[0.12em] text-cream">
          {title}
        </span>
        {subtitle && (
          <span className="font-body text-xs uppercase tracking-[0.1em] text-smoke">
            — {subtitle}
          </span>
        )}
        {selectedCount !== undefined && selectedCount > 0 && (
          <span className="font-body text-[0.625rem] text-ember ml-2">
            {selectedCount} selected
          </span>
        )}
      </div>
      <div className="flex-1 h-px bg-[rgba(196,148,58,0.15)]" />
    </div>
  );
}
