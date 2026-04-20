'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { AdminNav } from '@/components/admin/admin-nav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_auth');
    if (saved === 'true') setAuthed(true);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === 'Aviram2024!') {
      sessionStorage.setItem('admin_auth', 'true');
      setAuthed(true);
    } else {
      setError('סיסמה שגויה');
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center" dir="rtl">
        <div className="bg-card rounded-2xl border p-8 w-full max-w-sm shadow-lg">
          <h1 className="text-2xl font-black mb-2 text-center">ממשק ניהול</h1>
          <p className="text-muted-foreground text-sm text-center mb-6">הכנס סיסמה להמשך</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="סיסמה"
              className="w-full h-10 rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full h-10 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              כניסה
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex" dir="rtl">
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
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">A</div>
            <div>
              <p className="text-sm font-medium">מנהל</p>
              <button
                onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false); }}
                className="text-xs text-red-500 hover:underline"
              >
                התנתק
              </button>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}