import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import EmailPopup from '@/components/EmailPopup';

export const metadata: Metadata = {
  metadataBase: new URL('https://heatherandhickory.com'),
  title: {
    default: 'heather & hickory',
    template: '%s | heather & hickory',
  },
  description: 'Golf apparel built for the course. Rooted in tradition.',
  keywords: ['golf apparel', 'golf clothing', 'golf accessories', 'golf polo', 'golf hat', 'heritage golf', 'heather and hickory'],
  authors: [{ name: 'Heather & Hickory LLC' }],
  creator: 'Heather & Hickory LLC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://heatherandhickory.com',
    siteName: 'heather & hickory',
    title: 'heather & hickory',
    description: 'Golf apparel built for the course. Rooted in tradition.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'heather & hickory — Golf apparel built for the course.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'heather & hickory',
    description: 'Golf apparel built for the course. Rooted in tradition.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'AFzzVaD58vx0CipzH3K9UhbbIhcU_rnYMm_drx5hOsY', // just the content value, not the full tag
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <EmailPopup />
          <CartDrawer />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}