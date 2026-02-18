'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0 && status !== 'success') {
    return (
      <main className="min-h-screen bg-white pt-40 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-serif italic text-[#4c2a17] mb-4">Your bag is empty</h1>
        <p className="text-gray-400 text-sm mb-8 uppercase tracking-[0.2em]">Add some items before checking out</p>
        <a href="/shop/shop-all" className="bg-[#4c2a17] text-white px-10 py-4 text-xs uppercase tracking-[0.3em] hover:bg-[#435e48] transition-colors">
          Shop Now
        </a>
      </main>
    );
  }

  if (status === 'success') {
    return (
      <main className="min-h-screen bg-white pt-40 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full bg-[#435e48] flex items-center justify-center mb-8">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif italic text-[#4c2a17] mb-4">Order Confirmed</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-sm">
          Thank you for your purchase. You'll receive a confirmation email shortly.
        </p>
        <a href="/" className="bg-[#4c2a17] text-white px-10 py-4 text-xs uppercase tracking-[0.3em] hover:bg-[#435e48] transition-colors">
          Back to Home
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-50">
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-serif italic text-[#4c2a17] mb-4">Checkout</h1>
          <div className="h-0.5 w-24 bg-[#435e48] mx-auto"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* ORDER SUMMARY */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={`${item.id}-${item.variationId}`} className="flex gap-4 py-4 border-b border-gray-100">
                  <div className="w-20 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{item.category}</p>
                    <h3 className="text-sm font-serif text-[#4c2a17] mt-1">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-[#435e48]">
                        ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#4c2a17] border-t border-gray-100 pt-4 mt-4">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* PAYMENT FORM */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Payment</h2>
            
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
                {errorMessage}
              </div>
            )}

            <PaymentForm
              applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
              locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
              cardTokenizeResponseReceived={async (token) => {
                if (token.status !== 'OK' || !token.token) {
                  setErrorMessage('Card tokenization failed. Please try again.');
                  setStatus('error');
                  return;
                }
                setStatus('processing');
                setErrorMessage('');
                try {
                  const res = await fetch('/api/square', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      sourceId: token.token,
                      // Send items with productId, variationId, quantity — server verifies prices
                      items: items.map(item => ({
                        productId: item.id,
                        variationId: item.variationId || null,
                        quantity: item.quantity,
                      })),
                    }),
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setErrorMessage(data.error || 'Payment failed. Please try again.');
                    setStatus('error');
                  } else {
                    clearCart();
                    setStatus('success');
                  }
                } catch {
                  setErrorMessage('Something went wrong. Please try again.');
                  setStatus('error');
                }
              }}
            >
              <CreditCard
                buttonProps={{
                  css: {
                    backgroundColor: '#4c2a17',
                    color: 'white',
                    fontSize: '11px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    padding: '16px',
                    borderRadius: '0',
                    '&:hover': { backgroundColor: '#435e48' },
                  },
                }}
              >
                {status === 'processing' ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
              </CreditCard>
            </PaymentForm>

            <p className="mt-4 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
              Secured by Square · Your card details are encrypted
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}