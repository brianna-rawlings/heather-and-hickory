import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import EmailPopup from '@/components/EmailPopup';

export const metadata: Metadata = {
  title: "heather & hickory",
  description: "Golf apparel & accessories",
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