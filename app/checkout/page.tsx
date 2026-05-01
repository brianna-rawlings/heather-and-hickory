'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PaymentForm, CreditCard, ApplePay, GooglePay } from 'react-square-web-payments-sdk';
import { useCart } from '@/context/CartContext';

interface CustomerInfo {
  name: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
}

const DISCOUNT_CODES: Record<string, { freeShipping: boolean; percentOff: number; label: string }> = {
  'HICKORY10': { freeShipping: false, percentOff: 10, label: '10% off applied' },
  'KASITZ20': { freeShipping: false, percentOff: 20, label: '20% off applied' },
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'expedited' | 'pickup'>('standard');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    address: { line1: '', line2: '', city: '', state: '', zip: '' },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in customer.address) {
      setCustomer(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setCustomer(prev => ({ ...prev, [name]: value }));
    }
  };

  const applyCode = () => {
    const code = discountCode.toUpperCase().trim();
    if (DISCOUNT_CODES[code]) {
      setAppliedCode(code);
      setCodeError('');
    } else {
      setCodeError('Invalid discount code');
      setAppliedCode('');
    }
  };

  const discount = appliedCode ? DISCOUNT_CODES[appliedCode] : null;
  const discountAmount = discount?.percentOff ? totalPrice * discount.percentOff / 100 : 0;
  const qualifiesForFreeShipping = (totalPrice - discountAmount) >= 50;

  // Expedited is ALWAYS $14 — never free
  const shippingCost = shippingMethod === 'pickup'
  ? 0
  : shippingMethod === 'expedited'
  ? 14
  : (discount?.freeShipping || qualifiesForFreeShipping ? 0 : 7);

  const taxRate = customer.address.state.toUpperCase() === 'KS' ? 0.065 : 0;
  const taxAmount = parseFloat(((totalPrice - discountAmount) * taxRate).toFixed(2));
  const orderTotal = totalPrice - discountAmount + shippingCost + taxAmount;

  const isFormValid = customer.name && customer.email && customer.address.line1 && customer.address.city && customer.address.state && customer.address.zip;

  const handlePayment = async (token: any) => {
    if (!isFormValid) { setErrorMessage('Please fill in all required fields.'); return; }
    if (token.status !== 'OK' || !token.token) { setErrorMessage('Payment failed. Please try again.'); setStatus('error'); return; }
    setStatus('processing');
    setErrorMessage('');
    try {
      const res = await fetch('/api/square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: token.token,
          customer,
          shippingMethod,
          discountCode: appliedCode || '',
          items: items.map(item => ({
            productId: item.id,
            variationId: item.variationId || null,
            quantity: item.quantity,
            name: item.name,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Payment failed. Please try again.');
        setStatus('error');
      } else {
        clearCart();
        setOrderId(data.orderId || '');
        setStatus('success');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (items.length === 0 && status !== 'success') {
    return (
      <main className="min-h-screen bg-white pt-40 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-serif italic text-[#4c2a17] mb-4">Your bag is empty</h1>
        <p className="text-gray-400 text-sm mb-8 uppercase tracking-[0.2em]">Add some items before checking out</p>
        <Link href="/shop/shop-all" className="bg-[#4c2a17] text-white px-10 py-4 text-xs uppercase tracking-[0.3em] hover:bg-[#435e48] transition-colors">
          Shop Now
        </Link>
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
        <h1 className="text-3xl font-serif italic text-[#4c2a17] mb-2">Order Confirmed</h1>
        {orderId && <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Order #{orderId}</p>}
        <p className="text-gray-500 text-sm mb-2 max-w-sm">
          Thank you for your purchase! A confirmation email has been sent to <strong>{customer.email}</strong>.
        </p>
        <p className="text-gray-400 text-xs mb-8 max-w-sm">
          We'll send a shipping confirmation with tracking once your order is on its way.
        </p>
        <Link href="/" className="bg-[#4c2a17] text-white px-10 py-4 text-xs uppercase tracking-[0.3em] hover:bg-[#435e48] transition-colors">
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-40">
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-serif italic text-[#4c2a17] mb-4">Checkout</h1>
          <div className="h-0.5 w-24 bg-[#435e48] mx-auto"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* LEFT: Customer Info + Payment */}
          <div className="space-y-10">

            {/* Contact */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Full Name *</label>
                  <input type="text" name="name" value={customer.name} onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] transition-colors"
                    placeholder="Jane Smith" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Email Address *</label>
                  <input type="email" name="email" value={customer.email} onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] transition-colors"
                    placeholder="jane@email.com" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Address Line 1 *</label>
                  <input type="text" name="line1" value={customer.address.line1} onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] transition-colors"
                    placeholder="123 Main St" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Address Line 2</label>
                  <input type="text" name="line2" value={customer.address.line2} onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] transition-colors"
                    placeholder="Apt, suite, etc. (optional)" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">City *</label>
                    <input type="text" name="city" value={customer.address.city} onChange={handleChange}
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] transition-colors"
                      placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">State *</label>
                    <input type="text" name="state" value={customer.address.state} onChange={handleChange}
                      className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] transition-colors"
                      placeholder="IN" maxLength={2} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">ZIP Code *</label>
                  <input type="text" name="zip" value={customer.address.zip} onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] transition-colors"
                    placeholder="10001" maxLength={5} />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Shipping Method</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShippingMethod('standard')}
                  className={`w-full flex justify-between items-center px-4 py-4 border transition-all duration-200 ${shippingMethod === 'standard' ? 'border-[#4c2a17] bg-[#4c2a17]/5' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="text-left">
                    <p className="text-sm text-[#4c2a17] font-medium">Standard Shipping</p>
                    <p className="text-xs text-gray-400">5–7 business days</p>
                  </div>
                  <span className="text-sm font-semibold text-[#435e48]">
                    {discount?.freeShipping || qualifiesForFreeShipping ? 'Free' : '$7.00'}
                  </span>
                </button>
                <button
                  onClick={() => setShippingMethod('expedited')}
                  className={`w-full flex justify-between items-center px-4 py-4 border transition-all duration-200 ${shippingMethod === 'expedited' ? 'border-[#4c2a17] bg-[#4c2a17]/5' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="text-left">
                    <p className="text-sm text-[#4c2a17] font-medium">Expedited Shipping</p>
                    <p className="text-xs text-gray-400">2–3 business days</p>
                  </div>
                  <span className="text-sm font-semibold text-[#435e48]">$14.00</span>
                </button>
                <button
                  onClick={() => setShippingMethod('pickup')}
                  className={`w-full flex justify-between items-center px-4 py-4 border transition-all duration-200 ${shippingMethod === 'pickup' ? 'border-[#4c2a17] bg-[#4c2a17]/5' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="text-left">
                    <p className="text-sm text-[#4c2a17] font-medium">Taylor University Campus Pickup</p>
                    <p className="text-xs text-gray-400">We'll reach out to arrange pickup on campus</p>
                  </div>
                  <span className="text-sm font-semibold text-[#435e48]">Free</span>
                </button>
              </div>
            </div>

            {/* Discount Code */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Discount Code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                  className="flex-1 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] transition-colors"
                  placeholder="Enter code"
                />
                <button onClick={applyCode} className="bg-[#4c2a17] text-white px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#435e48] transition-colors">
                  Apply
                </button>
              </div>
              {appliedCode && (
                <p className="mt-2 text-xs text-[#435e48]">✓ {DISCOUNT_CODES[appliedCode].label}</p>
              )}
              {codeError && (
                <p className="mt-2 text-xs text-red-400">{codeError}</p>
              )}
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Payment</h2>

              {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
                  {errorMessage}
                </div>
              )}

              {!isFormValid && (
                <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-amber-500">
                  Please fill in all required fields above before entering payment details.
                </p>
              )}

              <PaymentForm
                key={`${orderTotal}-${shippingMethod}-${appliedCode}`}
                applicationId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
                locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
                cardTokenizeResponseReceived={handlePayment}
                createPaymentRequest={() => ({
                  countryCode: 'US',
                  currencyCode: 'USD',
                  total: { amount: orderTotal.toFixed(2), label: 'Heather & Hickory' },
                  lineItems: [
                    { label: 'Subtotal', amount: (totalPrice - discountAmount).toFixed(2) },
                    { label: shippingMethod === 'pickup' ? 'Campus Pickup' : shippingMethod === 'expedited' ? 'Expedited Shipping' : 'Standard Shipping', amount: shippingCost.toFixed(2) },
                    ...(taxAmount > 0 ? [{ label: 'Tax', amount: taxAmount.toFixed(2) }] : []),
                  ],
                })}
              >
                <ApplePay />
                <GooglePay />
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">or pay with card</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <CreditCard
                  buttonProps={{
                    css: {
                      backgroundColor: isFormValid ? '#4c2a17' : '#d1d5db',
                      color: 'white',
                      fontSize: '11px',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      padding: '16px',
                      borderRadius: '0',
                      '&:hover': { backgroundColor: isFormValid ? '#435e48' : '#d1d5db' },
                    },
                  }}
                >
                  {status === 'processing' ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}`}
                </CreditCard>
              </PaymentForm>

              <p className="mt-4 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                Secured by Square · Your card details are encrypted
              </p>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
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
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-[#435e48]">
                  <span>Discount ({appliedCode})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping {qualifiesForFreeShipping && shippingMethod === 'standard' && !discount?.freeShipping ? '(free over $50)' : ''}</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax (KS 6.5%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-[#4c2a17] border-t border-gray-100 pt-4 mt-4">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}