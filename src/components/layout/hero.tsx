import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-dark to-brand py-20 md:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-brand-light/20 blur-3xl" />
      </div>

      <div className="container relative text-center text-white">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          הצטרפו לחיסכון
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 text-white">
          {title.split(' ').map((word, i, arr) => {
            // Highlight specific keywords
            const highlighted = ['השווים', 'הנחות', 'מבצעים'];
            return (
              <span key={i}>
                {highlighted.includes(word) ? (
                  <span className="text-yellow-300">{word}</span>
                ) : word}
                {i < arr.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          {subtitle || 'האוצר שלכם לחיסכון חכם. אלפי קופונים, הנחות ומבצעים שאי אפשר לפספס מהאתרים המובילים בישראל ובעולם.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="bg-white text-brand hover:bg-white/90 font-bold gap-2">
            <Link href="/stores">
              גלו את המבצעים
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-medium">
            <Link href="/about">איך זה עובד?</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-12 text-center">
          {[
            { value: '1,500+', label: 'קופונים פעילים' },
            { value: '200+', label: 'חנויות מובילות' },
            { value: '98%', label: 'קופונים מאומתים' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
