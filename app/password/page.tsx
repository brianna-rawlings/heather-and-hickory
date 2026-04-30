'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await fetch('/api/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f7f4] flex items-center justify-center px-6">
      <div className="bg-white p-10 max-w-sm w-full text-center">
        <h1 className="text-3xl font-serif italic text-[#4c2a17] mb-2">heather & hickory</h1>
        <div className="h-0.5 w-16 bg-[#435e48] mx-auto mb-8"></div>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Enter password to access the site</p>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] mb-4 text-center tracking-widest"
          placeholder="••••••••••"
        />
        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#4c2a17] text-white py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#435e48] transition-colors"
        >
          Enter
        </button>
      </div>
    </main>
  );
}