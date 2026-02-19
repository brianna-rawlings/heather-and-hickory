'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-white pt-50">
      <div className="max-w-2xl mx-auto px-6 pb-24">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-serif italic text-[#4c2a17] mb-4">Contact Us</h1>
          <div className="h-0.5 w-24 bg-[#435e48] mx-auto"></div>
          <p className="mt-6 text-sm text-gray-500 leading-relaxed">
            Have a question about an order, sizing, or just want to say hello? We'd love to hear from you. 
            We typically respond within 1–2 business days.
          </p>
        </header>

        {status === 'success' ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#435e48] flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif italic text-[#4c2a17] mb-3">Message Sent!</h2>
            <p className="text-gray-500 text-sm">We'll get back to you within 1–2 business days.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#4c2a17] transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#4c2a17] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">Subject</label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#4c2a17] transition-colors bg-white"
              >
                <option value="">Select a topic</option>
                <option value="Order Question">Order Question</option>
                <option value="Sizing Help">Sizing Help</option>
                <option value="Returns & Exchanges">Returns & Exchanges</option>
                <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-500 mb-2">Message <span className="text-red-400">*</span></label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#4c2a17] transition-colors resize-none"
                placeholder="How can we help?"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-xs uppercase tracking-[0.2em]">Something went wrong. Please try again or email us directly.</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === 'sending' || !form.name || !form.email || !form.message}
              className={`w-full py-4 text-xs uppercase tracking-[0.3em] transition-all duration-300 ${
                !form.name || !form.email || !form.message
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : status === 'sending'
                  ? 'bg-[#435e48] text-white'
                  : 'bg-[#4c2a17] text-white hover:bg-[#435e48]'
              }`}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            <p className="text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
              Or email us directly at{' '}
              <a href="mailto:heatherandhickory@gmail.com" className="text-[#435e48] hover:text-[#4c2a17] transition-colors">
                heatherandhickory@gmail.com
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}