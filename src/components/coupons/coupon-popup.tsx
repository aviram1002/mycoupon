'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, ExternalLink, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Coupon } from '@/types';
import { getCouponAffiliateUrl, getCouponImageUrl, getDiscountDisplay, getBadgeLabel, getBadgeColor, formatDate, isExpiringSoon } from '@/lib/utils';

interface CouponPopupProps {
  coupon: Coupon | null;
  open: boolean;
  onClose: () => void;
}

export function CouponPopup({ coupon, open, onClose }: CouponPopupProps) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!coupon) return null;

  const store = coupon.store;
  const affiliateUrl = getCouponAffiliateUrl(coupon, store);
  const discountDisplay = getDiscountDisplay(coupon);
  const expiringSoon = isExpiringSoon(coupon.expires_at);

  async function handleCopy() {
    if (!coupon.code) return;
    await navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleGoToStore() {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center pt-10 pb-6 px-8 text-center">
          {/* Store Logo */}
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 overflow-hidden border">
            {store?.logo_url ? (
              <Image
                src={store.logo_url}
                alt={store.name || ''}
                width={64}
                height={64}
                className="object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {store?.name?.[0] || '?'}
              </span>
            )}
          </div>

          {/* Badge */}
          {coupon.badge && (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold mb-3 ${getBadgeColor(coupon.badge)}`}>
              {getBadgeLabel(coupon.badge)}
            </span>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold text-foreground leading-tight mb-2">
            {coupon.title}
          </h2>

          {/* Discount */}
          {discountDisplay && (
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-brand font-medium text-sm">OFF</span>
              <span className="text-4xl font-black text-foreground">{discountDisplay}</span>
            </div>
          )}
        </div>

        {/* Code Section */}
        {coupon.code ? (
          <div className="mx-6 mb-4">
            <p className="text-xs text-muted-foreground text-center mb-2">השתמשו בקוד הקופון בקופה:</p>
            <div className="flex items-center gap-2 border-2 border-dashed border-brand/30 rounded-2xl bg-brand-50 p-2">
              <Button
                onClick={handleCopy}
                className="flex-shrink-0 gap-2 bg-brand hover:bg-brand-dark rounded-xl"
                size="sm"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'הועתק!' : 'העתקה'}
              </Button>
              <span className="flex-1 text-center text-lg font-mono font-black tracking-widest text-foreground select-all">
                {coupon.code}
              </span>
            </div>
          </div>
        ) : null}

        {/* Go to Store Button */}
        <div className="px-6 pb-4">
          <Button
            onClick={handleGoToStore}
            className="w-full h-12 text-base font-bold rounded-2xl gap-2"
            size="lg"
          >
            <ExternalLink className="h-4 w-4" />
            מעבר לחנות
          </Button>
        </div>

        {/* Expiry Warning */}
        {expiringSoon && (
          <p className="text-center text-xs text-amber-600 font-medium pb-2">
            ⚡ מבצע מסתיים בקרוב!
          </p>
        )}
        {coupon.expires_at && !expiringSoon && (
          <p className="text-center text-xs text-muted-foreground pb-2">
            בתוקף עד: {formatDate(coupon.expires_at)}
          </p>
        )}

        {/* Details Toggle */}
        {coupon.description && (
          <div className="border-t mx-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-center gap-1 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              פרטי הקופון
            </button>
            {showDetails && (
              <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                {coupon.description}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t px-6 py-3 flex items-center justify-between bg-muted/30">
          <span className="text-xs font-semibold text-brand">HaCoupon Sheli</span>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <ShieldCheck className="h-3 w-3" />
            <span>נבדק לאחרונה: היום</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
