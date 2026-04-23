import Link from 'next/link';
import Image from 'next/image';
import { Tag } from 'lucide-react';
import type { Store } from '@/types';

interface StoreCardProps {
  store: Store;
  size?: 'sm' | 'md';
}

export function StoreCard({ store, size = 'md' }: StoreCardProps) {
  return (
    <Link
      href={`/store/${store.slug}`}
      className="group flex flex-col items-center p-4 bg-card rounded-2xl border hover:border-brand/30 hover:shadow-md transition-all hover:-translate-y-0.5"
    >
      <div className={`${size === 'sm' ? 'w-16 h-16' : 'w-20 h-20'} rounded-2xl bg-white flex items-center justify-center overflow-hidden border mb-3`}>
        {store.logo_url ? (
          <Image
            src={store.logo_url}
            alt={store.name}
            width={size === 'sm' ? 64 : 80}
            height={size === 'sm' ? 64 : 80}
            className="object-contain w-full h-full p-1"
          />
        ) : (
          <span className="text-xl font-bold text-muted-foreground">{store.name[0]}</span>
        )}
      </div>
      <p className="font-semibold text-sm text-foreground group-hover:text-brand transition-colors text-center">
        {store.name}
      </p>
      {store.coupon_count > 0 && (
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-0.5">
          <Tag className="h-3 w-3" />
          {store.coupon_count} קופונים
        </p>
      )}
    </Link>
  );
}
