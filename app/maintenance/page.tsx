export default function MaintenancePage() {
    return (
      <main className="min-h-screen bg-[#f9f7f4] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-6xl text-[#4c2a17] mb-4" style={{ fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif', fontStyle: 'italic' }}>
          heather & hickory
        </h1>
        <div className="h-0.5 w-24 bg-[#435e48] mx-auto mb-8"></div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#435e48] mb-3">Golf Apparel & Accessories</p>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-10">
          We're putting the finishing touches on something special. Check back soon.
        </p>
        <a
          href="mailto:heatherandhickory@gmail.com"
          className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] border-b border-[#4c2a17] pb-1 hover:text-[#435e48] hover:border-[#435e48] transition"
        >
          heatherandhickory@gmail.com
        </a>
      </main>
    );
  }