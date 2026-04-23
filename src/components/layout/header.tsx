'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Tag, Menu, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/stores', label: 'חנויות מובילות' },
  { href: '/coupons', label: 'קופונים חדשים' },
  { href: '/categories', label: 'קטגוריות' },
  { href: '/blog', label: 'בלוג' },
];

interface SearchResult {
  id: string;
  title?: string;
  name?: string;
  slug: string;
  type: 'coupon' | 'store';
  discount_value?: number;
  discount_type?: string;
  coupon_type?: string;
  logo_url?: string;
  store?: { name: string; logo_url?: string };
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) { setResults([]); setSearched(false); return; }
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
    const timer = setTimeout(() => doSearch(query), 350);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  function getDiscountLabel(item: SearchResult) {
    if (item.coupon_type === 'free_shipping') return 'משלוח חינם';
    if (!item.discount_value) return '';
    if (item.discount_type === 'percent') return `${item.discount_value}%`;
    return `₪${item.discount_value}`;
  }

  function clearSearch() {
    setQuery('');
    setResults([]);
    setSearched(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-brand transition-colors shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand text-white">
            <Tag className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">הקופון שלי</span>
        </Link>

        {/* Search bar - Desktop (expands in header) */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative">
          <div className={`relative w-full transition-all duration-200`}>
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="חפש קופון או חנות..."
              className="w-full h-9 pr-9 pl-8 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:bg-background transition"
              dir="rtl"
            />
            {query && (
              <button onClick={clearSearch} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {searchOpen && (query.length >= 2) && (
            <div className="absolute top-full mt-2 right-0 w-full bg-background border border-border rounded-2xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> מחפש...
                </div>
              )}
              {!loading && searched && results.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">לא נמצאו תוצאות</div>
              )}
              {!loading && results.length > 0 && (
                <div>
                  {results.map(item => (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={item.type === 'store' ? `/store/${item.slug}` : `/coupon/${item.slug}`}
                      onClick={() => { setSearchOpen(false); clearSearch(); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                    >
                      {(item.store?.logo_url || item.logo_url) && (
                        <div className="w-8 h-8 rounded-lg border bg-white flex items-center justify-center shrink-0 overflow-hidden">
                          <Image
                            src={item.store?.logo_url || item.logo_url || ''}
                            alt=""
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title || item.name}</p>
                        {item.store && <p className="text-xs text-muted-foreground">{item.store.name}</p>}
                        {item.type === 'store' && <p className="text-xs text-muted-foreground">חנות</p>}
                      </div>
                      {getDiscountLabel(item) && (
                        <span className="text-xs font-bold bg-brand/10 text-brand px-2 py-0.5 rounded-full shrink-0">
                          {getDiscountLabel(item)}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nav - Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium shrink-0">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile: search icon + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => { setSearchOpen(o => !o); setMenuOpen(false); }} aria-label="חיפוש">
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { setMenuOpen(o => !o); setSearchOpen(false); }} aria-label="תפריט">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-border/50 px-4 py-3 bg-background">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="חפש קופון או חנות..."
              className="w-full h-10 pr-9 pl-8 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:bg-background transition"
              dir="rtl"
            />
            {query && (
              <button onClick={clearSearch} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Mobile results */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> מחפש...
            </div>
          )}
          {!loading && searched && results.length === 0 && query.length >= 2 && (
            <div className="py-4 text-center text-sm text-muted-foreground">לא נמצאו תוצאות</div>
          )}
          {!loading && results.length > 0 && (
            <div className="mt-2 flex flex-col border border-border rounded-xl overflow-hidden">
              {results.map(item => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.type === 'store' ? `/store/${item.slug}` : `/coupon/${item.slug}`}
                  onClick={() => setTimeout(() => { setSearchOpen(false); clearSearch(); }, 100)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                >
                  {(item.store?.logo_url || item.logo_url) && (
                    <div className="w-7 h-7 rounded-lg border bg-white flex items-center justify-center shrink-0 overflow-hidden">
                      <Image src={item.store?.logo_url || item.logo_url || ''} alt="" width={28} height={28} className="object-contain" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title || item.name}</p>
                    {item.store && <p className="text-xs text-muted-foreground">{item.store.name}</p>}
                  </div>
                  {getDiscountLabel(item) && (
                    <span className="text-xs font-bold bg-brand/10 text-brand px-2 py-0.5 rounded-full shrink-0">
                      {getDiscountLabel(item)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background px-4 py-4 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-lg hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
