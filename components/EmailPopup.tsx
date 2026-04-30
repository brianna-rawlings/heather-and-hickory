'use client';
import { useState, useEffect } from 'react';

export default function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('hh_popup_seen')) return;
    const handleScroll = () => {
      const videoHeight = window.innerHeight; // hero is h-screen
      if (window.scrollY > videoHeight) {
        setVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('hh_popup_seen', 'true');
  };

  const handleSubmit = async () => {
    if (!email) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        localStorage.setItem('hh_popup_seen', 'true');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleDismiss} />

      {/* Modal */}
      <div className="relative bg-white max-w-md w-full p-10 text-center">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>

        {status === 'success' ? (
          <>
            <h2 className="text-3xl font-serif italic text-[#4c2a17] mb-3">you're in!</h2>
            <div className="h-0.5 w-16 bg-[#435e48] mx-auto mb-6"></div>
            <p className="text-sm text-gray-500 mb-4">your discount code is on its way to your inbox. use it at checkout for 10% off your first order.</p>
            <p className="text-lg font-bold text-[#4c2a17] tracking-widest">HICKORY10</p>
            <button onClick={handleDismiss} className="mt-6 w-full bg-[#4c2a17] text-white py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#435e48] transition-colors">
              Shop Now
            </button>
          </>
        ) : (
          <>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#435e48] mb-3">welcome to heather & hickory</p>
            <h2 className="text-3xl font-serif italic text-[#4c2a17] mb-3">get 10% off your first order</h2>
            <div className="h-0.5 w-16 bg-[#435e48] mx-auto mb-6"></div>
            <p className="text-sm text-gray-500 mb-6">sign up for early access, new arrivals, and exclusive offers.</p>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] transition-colors mb-3"
              placeholder="your@email.com"
            />

            {status === 'error' && (
              <p className="text-red-400 text-xs mb-3">Something went wrong. Please try again.</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!email || status === 'sending'}
              className={`w-full py-3 text-xs uppercase tracking-[0.3em] transition-colors mb-3 ${
                !email ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#4c2a17] text-white hover:bg-[#435e48]'
              }`}
            >
              {status === 'sending' ? 'sending...' : 'get my 10% off'}
            </button>

            <button onClick={handleDismiss} className="text-[10px] text-gray-400 uppercase tracking-[0.2em] hover:text-gray-600 transition-colors">
              no thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
}