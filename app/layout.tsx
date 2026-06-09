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
    <html lang="en">
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