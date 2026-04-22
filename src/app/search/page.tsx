'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Result {
  id: string;
  title: string;
  description?: string;
  code?: string;
  discount_value?: number;
  discount_type?: string;
  coupon_type?: string;
  slug: string;
  store?: { name: string; logo_url?: string; slug: string };
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  function getDiscountLabel(item: Result) {
    if (item.coupon_type === 'free_shipping') return 'משלוח חינם';
    if (!item.discount_value) return '';
    if (item.discount_type === 'percent') return `${item.discount_value}% הנחה`;
    return `₪${item.discount_value} הנחה`;
  }

  return (
    <div className="container max-w-2xl py-10 px-4">
      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="חפש קופון או חנות..."
          className="w-full h-14 pr-12 pl-12 rounded-2xl border border-border bg-card text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/40 transition"
          dir="rtl"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-muted-foreground text-sm py-10">מחפש...</div>
      )}

      {/* No results */}
      {!loading && searched && results.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-10">
          לא נמצאו תוצאות עבור &quot;{query}&quot;
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground mb-1">נמצאו {results.length} תוצאות</p>
          {results.map(item => (
            <Link
              key={item.id}
              href={`/coupon/${item.slug}`}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:border-brand/30 transition-all"
            >
              {item.store?.logo_url && (
                <div className="w-12 h-12 rounded-xl border bg-white flex items-center justify-center shrink-0 overflow-hidden">
                  <Image
                    src={item.store.logo_url}
                    alt={item.store.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.title}</p>
                {item.store && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.store.name}</p>
                )}
              </div>
              {getDiscountLabel(item) && (
                <span className="shrink-0 text-xs font-bold bg-brand/10 text-brand px-2.5 py-1 rounded-full">
                  {getDiscountLabel(item)}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!searched && (
        <div className="text-center text-muted-foreground text-sm py-10">
          התחל להקליד כדי לחפש קופונים וחנויות
        </div>
      )}
    </div>
  );
}
