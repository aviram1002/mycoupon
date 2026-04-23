'use client';
import Image from 'next/image';
import { Clock, Users, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Coupon } from '@/types';
import {
  getCouponImageUrl, getDiscountDisplay, getBadgeLabel,
  formatDate, isExpired, isExpiringSoon, getDaysUntilExpiry,
} from '@/lib/utils';

interface CouponCardProps {
  coupon: Coupon;
  onOpenPopup: (coupon: Coupon) => void;
  showStore?: boolean;
}

export function CouponCard({ coupon, onOpenPopup, showStore = false }: CouponCardProps) {
  const store = coupon.store;
  const imageUrl = getCouponImageUrl(coupon, store);
  const discountDisplay = getDiscountDisplay(coupon);
  const expired = isExpired(coupon.expires_at);
  const expiringSoon = isExpiringSoon(coupon.expires_at);
  const daysLeft = getDaysUntilExpiry(coupon.expires_at);

  return (
    <div className={`group relative bg-card rounded-2xl border overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${expired ? 'opacity-60' : ''}`}>
      {/* Image */}
      <div className="relative h-44 bg-muted overflow-hidden">
        <Image
          src={imageUrl}
          alt={coupon.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300 p-2"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = store?.logo_url || '/placeholder-coupon.png';
          }}
        />
        {/* Badge overlay */}
        {coupon.badge && (
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold backdrop-blur-sm bg-white/90 ${
              coupon.badge === 'exclusive' ? 'border-purple-200 text-purple-700' :
              coupon.badge === 'verified' ? 'border-green-200 text-green-700' :
              coupon.badge === 'popular' ? 'border-orange-200 text-orange-700' :
              'border-blue-200 text-blue-700'
            }`}>
              {getBadgeLabel(coupon.badge)}
            </span>
          </div>
        )}
        {/* Discount overlay */}
        {discountDisplay && (
          <div className="absolute bottom-2 left-2 bg-brand text-white rounded-xl px-2.5 py-1">
            <span className="text-sm font-black">{discountDisplay}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {showStore && store && (
          <p className="text-xs text-muted-foreground mb-1 font-medium">{store.name}</p>
        )}
        <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2">{coupon.title}</h3>

        {coupon.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {coupon.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
          {coupon.expires_at && (
            <span className={`flex items-center gap-1 ${expiringSoon ? 'text-amber-600 font-medium' : ''}`}>
              <Clock className="h-3 w-3" />
              {expired ? 'פג תוקף' : expiringSoon ? `${daysLeft} ימים נותרו` : `עד ${formatDate(coupon.expires_at)}`}
            </span>
          )}
          {coupon.uses_count > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {coupon.uses_count.toLocaleString('he-IL')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {coupon.code ? (
            <>
              <Button
                onClick={() => onOpenPopup(coupon)}
                className="flex-1"
                size="sm"
                disabled={expired}
              >
                <Tag className="h-3 w-3 ml-1" />
                קבל קוד
              </Button>
              <Button
                onClick={() => onOpenPopup(coupon)}
                variant="outline"
                size="sm"
                disabled={expired}
              >
                מעבר לחנות
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onOpenPopup(coupon)}
              className="w-full"
              size="sm"
              variant={coupon.coupon_type === 'free_shipping' ? 'outline' : 'default'}
              disabled={expired}
            >
              {coupon.coupon_type === 'free_shipping' ? '🚚 הפעל מבצע' : 'מעבר לחנות'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
