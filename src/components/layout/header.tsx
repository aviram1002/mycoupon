import Link from 'next/link';
import { Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-brand transition-colors">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand text-white">
            <Tag className="w-4 h-4" />
          </div>
          הקופון שלי
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/stores" className="text-muted-foreground hover:text-foreground transition-colors">
            חנויות מובילות
          </Link>
          <Link href="/coupons" className="text-muted-foreground hover:text-foreground transition-colors">
            קופונים חדשים
          </Link>
          <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
            קטגוריות
          </Link>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
            בלוג
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search" aria-label="חיפוש">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin">התחברות</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
