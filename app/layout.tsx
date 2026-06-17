import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import EmailPopup from '@/components/EmailPopup';
import SaleBanner from "@/components/SaleBanner";
import SaleContent from "@/components/SaleContent";
import InstagramFeed from "@/components/InstagramFeed"; // 👈 1. ADD THIS IMPORT TO FIX THE RED SQUIGGLY

import { Libre_Caslon_Display, Jost } from 'next/font/google';

const libreCaslon = Libre_Caslon_Display({ subsets: ['latin'], weight: '400', variable: '--font-caslon', display: 'swap' });
const jost = Jost({ subsets: ['latin'], variable: '--font-jost', display: 'swap' });



export const metadata: Metadata = {
  metadataBase: new URL('https://heatherandhickory.com'),
  title: {
    default: 'heather & hickory — Golf Apparel Built for the Course',
    template: '%s | heather & hickory',
  },
  description: 'Heritage-inspired golf apparel and accessories built for the course. Shop polos, pullovers, hats, and small goods from heather & hickory.',
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
};

// JSON-LD Organization schema — tells Google about your brand
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Heather & Hickory',
  alternateName: 'heather & hickory',
  url: 'https://heatherandhickory.com',
  logo: 'https://heatherandhickory.com/logo.png',
  description: 'Golf apparel built for the course. Rooted in tradition.',
  email: 'heatherandhickory@gmail.com',
  sameAs: [
    'https://www.instagram.com/heatherandhickory/',
    'https://www.pinterest.com/heatherandhickory/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'heatherandhickory@gmail.com',
    contactType: 'Customer Service',
    availableLanguage: 'English',
  },
};

// JSON-LD WebSite schema — enables sitelinks search box in Google results
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'heather & hickory',
  url: 'https://heatherandhickory.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://heatherandhickory.com/shop/shop-all?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${libreCaslon.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <CartProvider>
          <SaleBanner />
          <Navbar />
          <EmailPopup />
          <CartDrawer />
          <SaleContent>{children}</SaleContent>
          <InstagramFeed />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}