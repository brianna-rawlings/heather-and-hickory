'use client';

import BeholdWidget from "@behold/react";

// Replace with the ID string inside your feed-id="" snippet from Behold
const FEED_ID = 'M2lGoHpU2Hm78lEbEdZY'; 

export default function InstagramFeed() {
  if (!FEED_ID) return null;

  return (
    <section className="bg-[#f9f7f4] py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Content */}
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#435e48] mb-3">Follow Along</p>
          <a 
            href="https://www.instagram.com/heatherandhickory/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-3xl font-serif italic text-[#4c2a17] hover:text-[#435e48] transition-colors"
          >
            @heatherandhickory
          </a>
          <div className="h-0.5 w-16 bg-[#435e48] mx-auto mt-4"></div>
        </div>

        {/* Your Styled Behold Feed */}
        <div className="w-full">
          <BeholdWidget feedId={FEED_ID} />
        </div>

        {/* Footer Link Content */}
        <div className="text-center mt-12">
          <a 
            href="https://www.instagram.com/heatherandhickory/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-xs uppercase tracking-[0.2em] text-[#4c2a17] border-b border-[#4c2a17] pb-1 hover:text-[#435e48] hover:border-[#435e48] transition"
          >
            Follow on Instagram
          </a>
        </div>
        
      </div>
    </section>
  );
}