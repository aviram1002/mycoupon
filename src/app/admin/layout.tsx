import Link from 'next/link';
import { LayoutDashboard, Tag, Store, HelpCircle, Settings, ChevronLeft } from 'lucide-react';
import { AdminNav } from '@/components/admin/admin-nav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-l flex flex-col flex-shrink-0">
        <div className="p-5 border-b">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-1">
            <ChevronLeft className="h-3.5 w-3.5" />
            חזרה לאתר
          </Link>
          <h1 className="text-lg font-black text-foreground mt-2">הקופון שלי</h1>
          <p className="text-xs text-muted-foreground">ניהול מערכת</p>
        </div>

        <AdminNav />

        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">A</div>
            <div>
              <p className="text-sm font-medium">מנהל</p>
              <p className="text-xs text-muted-foreground">admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
