// app/story/page.tsx

export default function StoryPage() {
    return (
      <main className="min-h-screen bg-white pt-32">
        <section className="max-w-4xl mx-auto px-6 py-20">
          <h1 
            className="text-6xl italic text-[#4c2a17] mb-12 text-center"
            style={{ fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif' }}
          >
            Our Story
          </h1>
          
          <div className="space-y-12 text-[#4c2a17] leading-relaxed">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-gray-100 aspect-square rounded-sm overflow-hidden relative">
                 <img 
                   src="/littlekyle.jpeg" 
                   className="object-cover h-full w-full" 
                   alt="The Heather Landscapes" 
                 />
              </div>
              <div>
                <h2 className="text-2xl italic mb-4 font-serif">The Heather</h2>
                <p className="text-sm tracking-wide">
                  Born from the rugged landscapes where the game began, the 'Heather' represents the 
                  resilience and natural beauty of the classic links. Our designs are inspired by 
                  the textures and tones of the Scottish highlands.
                </p>
              </div>
            </div>
  
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl italic mb-4 font-serif">The Hickory</h2>
                <p className="text-sm tracking-wide">
                  Hickory represents the era of craftsmanship. It’s a nod to the tools, the 
                  restoration of vintage feel, and the tactile nature of a game played with 
                  precision and soul.
                </p>
              </div>
              <div className="bg-gray-100 aspect-square rounded-sm overflow-hidden order-1 md:order-2">
                 <img 
                   src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800" 
                   className="object-cover h-full w-full" 
                   alt="Hickory Craftsmanship" 
                 />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }