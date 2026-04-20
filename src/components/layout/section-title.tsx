import Link from 'next/link';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function SectionTitle({ title, subtitle, viewAllHref, viewAllLabel = 'לכל החנויות' }: SectionTitleProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-black text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        <div className="w-10 h-0.5 bg-brand mt-2 rounded-full" />
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-sm text-brand hover:text-brand-dark font-medium transition-colors"
        >
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}
