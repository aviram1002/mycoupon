import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Coupon, Store } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(dateStr));
}

export function isExpired(dateStr?: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export function isExpiringSoon(dateStr?: string | null, hours = 48): boolean {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return diff > 0 && diff < hours * 60 * 60 * 1000;
}

export function getDaysUntilExpiry(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  if (diff < 0) return null;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getCouponImageUrl(coupon: Coupon, store?: Store): string {
  return coupon.image_url || store?.logo_url || coupon.store?.logo_url || '/placeholder-coupon.png';
}

export function getCouponAffiliateUrl(coupon: Coupon, store?: Store): string {
  return coupon.affiliate_url || store?.affiliate_url || coupon.store?.affiliate_url || store?.website_url || coupon.store?.website_url || '#';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function getBadgeLabel(badge?: string | null): string {
  const map: Record<string, string> = {
    exclusive: 'בלעדי',
    verified: 'מאומת',
    popular: 'פופולרי',
    new: 'חדש',
  };
  return badge ? (map[badge] || badge) : '';
}

export function getBadgeColor(badge?: string | null): string {
  const map: Record<string, string> = {
    exclusive: 'bg-purple-100 text-purple-700 border-purple-200',
    verified: 'bg-green-100 text-green-700 border-green-200',
    popular: 'bg-orange-100 text-orange-700 border-orange-200',
    new: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return badge ? (map[badge] || 'bg-gray-100 text-gray-700') : '';
}

export function getDiscountDisplay(coupon: Coupon): string {
  if (coupon.discount_label) return coupon.discount_label;
  if (coupon.discount_type === 'percent' && coupon.discount_value) return `${coupon.discount_value}% OFF`;
  if (coupon.discount_type === 'fixed' && coupon.discount_value) return `₪${coupon.discount_value}`;
  if (coupon.discount_type === 'free_shipping') return 'FREE';
  return '';
}

export function buildCanonicalUrl(storeSlug: string, filters?: Record<string, string>): string {
  const base = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/store/${storeSlug}`;
  if (!filters || Object.keys(filters).length === 0) return base;
  const params = new URLSearchParams(filters);
  return `${base}?${params.toString()}`;
}
