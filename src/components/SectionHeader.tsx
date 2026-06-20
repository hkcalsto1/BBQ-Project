import { useScrollReveal } from '@/hooks/useScrollReveal';

interface Props {
  label: string;
  heading: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({ label, heading, subtitle, align = 'center' }: Props) {
  const ref = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.9 });

  return (
    <div
      ref={ref}
      className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <span className="section-label">{label}</span>
      <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] text-cream leading-tight mt-4">
        {heading}
      </h2>
      {subtitle && (
        <p className="font-body text-base font-light text-[rgba(245,230,200,0.6)] mt-3">
          {subtitle}
        </p>
      )}
      {align === 'center' && (
        <div className="w-20 h-px bg-[rgba(196,148,58,0.3)] mx-auto mt-8" />
      )}
    </div>
  );
}
