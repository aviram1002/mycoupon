import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
      <div className="text-8xl mb-6">🎫</div>
      <h1 className="text-4xl font-black mb-3">404 - הדף לא נמצא</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        נראה שהדף שחיפשתם לא קיים. אולי הקישור שבר, או שהדף הוסר.
      </p>
      <div className="flex gap-3">
        <Button asChild size="lg">
          <Link href="/">חזרה לדף הבית</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/stores">כל החנויות</Link>
        </Button>
      </div>
    </div>
  );
}
