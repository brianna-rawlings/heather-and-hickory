import './globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Heather & Hickory | Tradition Never Graduates',
  description: 'Premium golf apparel and accessories.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-heather-green selection:text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}