'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Tag, Store, HelpCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'סקירה כללית', icon: LayoutDashboard, exact: true },
  { href: '/admin/coupons', label: 'ניהול קופונים', icon: Tag },
  { href: '/admin/stores', label: 'ניהול חנויות', icon: Store },
  { href: '/admin/faqs', label: 'ניהול שאלות', icon: HelpCircle },
  { href: '/admin/settings', label: 'הגדרות', icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-3">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5',
              isActive
                ? 'bg-brand-50 text-brand font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
