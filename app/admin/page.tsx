'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('USPS');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleAuth = () => {
    if (password === 'Br20042004!') {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleSubmit = async () => {
    if (!orderId || !customerEmail || !customerName || !trackingNumber) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, customerEmail, customerName, trackingNumber, carrier }),
      });
      if (res.ok) {
        setStatus('success');
        setMessage(`Shipping confirmation sent to ${customerEmail}`);
        setOrderId('');
        setCustomerEmail('');
        setCustomerName('');
        setTrackingNumber('');
      } else {
        setStatus('error');
        setMessage('Failed to send email. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong.');
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#f9f7f4] flex items-center justify-center px-6">
        <div className="bg-white p-10 max-w-sm w-full">
          <h1 className="text-2xl font-serif italic text-[#4c2a17] mb-2">Admin</h1>
          <div className="h-0.5 w-12 bg-[#435e48] mb-8"></div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] mb-4"
            placeholder="Enter password"
          />
          {authError && <p className="text-red-400 text-xs mb-4">{authError}</p>}
          <button onClick={handleAuth} className="w-full bg-[#4c2a17] text-white py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#435e48] transition-colors">
            Enter
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f7f4] pt-50 px-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-serif italic text-[#4c2a17] mb-2">heather & hickory</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#435e48] mb-2">Admin Panel</p>
        <div className="h-0.5 w-16 bg-[#435e48] mb-10"></div>

        <div className="bg-white p-8 mb-6">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Send Shipping Confirmation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Order ID</label>
              <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17]"
                placeholder="e.g. HH123456" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Customer Name</label>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17]"
                placeholder="Jane Smith" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Customer Email</label>
              <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17]"
                placeholder="jane@email.com" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Carrier</label>
              <select value={carrier} onChange={e => setCarrier(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] bg-white">
                <option>USPS</option>
                <option>UPS</option>
                <option>FedEx</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Tracking Number</label>
              <input type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17]"
                placeholder="1Z999AA10123456784" />
            </div>
          </div>

          {message && (
            <p className={`mt-4 text-xs ${status === 'success' ? 'text-[#435e48]' : 'text-red-400'}`}>{message}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!orderId || !customerEmail || !customerName || !trackingNumber || status === 'sending'}
            className={`w-full mt-6 py-4 text-xs uppercase tracking-[0.3em] transition-all duration-300 ${
              !orderId || !customerEmail || !customerName || !trackingNumber
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : status === 'sending'
                ? 'bg-[#435e48] text-white'
                : 'bg-[#4c2a17] text-white hover:bg-[#435e48]'
            }`}
          >
            {status === 'sending' ? 'Sending...' : 'Send Shipping Confirmation'}
          </button>
        </div>

        {/* Discount Codes Reference */}
        <div className="bg-white p-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Active Discount Codes</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-bold text-[#4c2a17]">HHFREESHIP</p>
                <p className="text-xs text-gray-400">Free shipping</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#435e48]">Active</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-bold text-[#4c2a17]">TAYLOR10</p>
                <p className="text-xs text-gray-400">10% off + free shipping</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#435e48]">Active</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}