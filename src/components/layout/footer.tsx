import Link from 'next/link';
import { Tag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground mb-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand text-white">
                <Tag className="w-3.5 h-3.5" />
              </div>
              הקופון שלי
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              האוצר שלכם לחיסכון חכם. אלפי קופונים, הנחות ומבצעים שאי אפשס לאתרים המובילים בישראל ובעולם.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">חנויות</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/store/ksp" className="hover:text-foreground transition-colors">KSP</Link></li>
              <li><Link href="/store/amazon" className="hover:text-foreground transition-colors">Amazon</Link></li>
              <li><Link href="/store/nike" className="hover:text-foreground transition-colors">Nike</Link></li>
              <li><Link href="/stores" className="hover:text-foreground transition-colors">כל החנויות</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">קטגוריות</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/category/fashion" className="hover:text-foreground transition-colors">אופנה</Link></li>
              <li><Link href="/category/electronics" className="hover:text-foreground transition-colors">אלקטרוניקה</Link></li>
              <li><Link href="/category/travel" className="hover:text-foreground transition-colors">טיסות ותיירות</Link></li>
              <li><Link href="/category/food" className="hover:text-foreground transition-colors">אוכל ומסעדות</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">אודות</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">אודות</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">צור קשר</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">מדיניות פרטיות</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">תקנון אתר</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 הקופון שלי - האוצר שלכם לחיסכון חכם
          </p>
          <p className="text-xs text-muted-foreground">
            נבנה באהבה 💙 לחסכנים הישראלים
          </p>
        </div>
      </div>
    </footer>
  );
}
