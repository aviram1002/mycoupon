'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { CouponFilters } from '@/types';

interface CouponFiltersBarProps {
  filters: CouponFilters;
}

export function CouponFiltersBar({ filters }: CouponFiltersBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: keyof CouponFilters, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === 'newest') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const typeOptions = [
    { value: 'all', label: 'הכל' },
    { value: 'code', label: 'קוד קופון' },
    { value: 'deal', label: 'דיל' },
    { value: 'free_shipping', label: 'משלוח חינם' },
  ];

  const statusOptions = [
    { value: 'all', label: 'הכל' },
    { value: 'active', label: 'פעיל עכשיו' },
    { value: 'expired', label: 'פג תוקף' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'הכי חדש' },
    { value: 'popular', label: 'הכי פופולרי' },
    { value: 'expiring', label: 'מסתיים בקרוב' },
  ];

  return (
    <div className="bg-card rounded-2xl border p-4 space-y-4">
      <p className="text-sm font-semibold text-muted-foreground">סינון תוצאות</p>

      {/* Type Filter */}
      <div>
        <p className="text-xs font-medium mb-2 text-muted-foreground">סוג קופון</p>
        <div className="flex flex-col gap-1.5">
          {typeOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateFilter('type', opt.value)}
              className={`text-sm text-right py-1.5 px-2 rounded-lg transition-colors ${
                (filters.type || 'all') === opt.value
                  ? 'bg-brand-50 text-brand font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <p className="text-xs font-medium mb-2 text-muted-foreground">סטטוס</p>
        <div className="flex flex-col gap-1.5">
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateFilter('status', opt.value)}
              className={`text-sm text-right py-1.5 px-2 rounded-lg transition-colors ${
                (filters.status || 'all') === opt.value
                  ? 'bg-brand-50 text-brand font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-medium mb-2 text-muted-foreground">מיון לפי</p>
        <div className="flex flex-col gap-1.5">
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateFilter('sort', opt.value)}
              className={`text-sm text-right py-1.5 px-2 rounded-lg transition-colors ${
                (filters.sort || 'newest') === opt.value
                  ? 'bg-brand-50 text-brand font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      {(filters.type || filters.status || filters.sort) && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={() => router.push(pathname, { scroll: false })}
        >
          איפוס פילטרים
        </Button>
      )}
    </div>
  );
}
