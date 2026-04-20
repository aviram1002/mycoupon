import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from 'sonner';
import { generateSiteSchema } from '@/lib/schema';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mycoupon.co.il';
const siteName = 'הקופון שלי';

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteName}`,
    default: `${siteName} - כל הקופונים השווים במקום אחד`,
  },
  description: 'מצא את הקופונים והדילים המשתלמים ביותר בישראל. אלפי קופונים מאומתים לחנויות המובילות.',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName,
    title: `${siteName} - כל הקופונים השווים במקום אחד`,
    description: 'מצא את הקופונים והדילים המשתלמים ביותר בישראל',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = generateSiteSchema(siteUrl, siteName);

  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className={`${heebo.className} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
