// app/story/page.tsx
"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

const images = [
  { src: "/kasitz.JPG", alt: "Kyle, Mom, Dad" },
  { src: "/kasitz2.JPG", alt: "Kyle, Mom, Dad, Adam" },
  // Add more images here
];

export default function StoryPage() {
  const [current, setCurrent] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (images.length <= 1) return; // no slideshow needed for single image
  
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % images.length);
        setOpacity(1);
      }, 500);
    }, 4000);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white pt-52">
      
      {/* Editorial Header */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-24">
        <h1 
          className="text-6xl italic text-[#4c2a17] mb-6"
          style={{ fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif' }}
        >
          Tradition Never Fades
        </h1>
        <div className="h-1 w-20 bg-[#435e48] mx-auto mb-8"></div>
        <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-bold">
          A Letter from the Founder
        </p>
      </section>

      {/* Main Narrative Section */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Slideshow */}
          <div className="relative aspect-[4/5] overflow-hidden shadow-2xl bg-gray-100">
            <Image 
              src={images[current].src}
              alt={images[current].alt}
              fill 
              className="object-cover"
              style={{
                opacity,
                transition: 'opacity 0.5s ease-in-out',
              }}
            />
            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: 'white',
                    opacity: i === current ? 1 : 0.5,
                    transform: i === current ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 
              className="text-4xl italic text-[#4c2a17]"
              style={{ fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif' }}
            >
              The Story
            </h2>
            
            <div className="space-y-6 text-[#4c2a17] leading-relaxed text-[15px] tracking-wide font-light">
              <p>
                Hey there! I am <span className="font-bold">Kyle Kasitz</span>, the founder of <span 
                    className="font-bold text-[#4c2a17]" 
                    style={{ fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif' }}
                  >
                    heather&hickory.
                  </span>{' '}
                I grew up in Wichita, Kansas, and golf has been a part of my life for as long as I can remember.
                My family and I have always been passionate about the game, and it has played a 
                significant role in shaping who I am today. 
              </p>

              <p>
                After high school, I was blessed to have the opportunity to play college golf at 
                Taylor University, where I am currently playing my senior season today. 
                This environment further deepened my appreciation for the game's history 
                and the standard of excellence it requires.
              </p>

              <p>
                This is why we created <span 
                    className="font-bold text-[#4c2a17]" 
                    style={{ fontFamily: '"Bodoni 72 Oldstyle", "Bodoni 72", serif' }}
                  >
                    heather&hickory.
                  </span>{' '} 
                We wanted to honor those traditions and share our love for golf through our clothes. 
                Every piece we create is a reflection of that heritage, designed to share
                the history of golf into modern styles of clothing that can be worn on and off the course.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100">
               <p className="font-serif italic text-xl text-[#4c2a17]">Kyle Kasitz</p>
               <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-[#5d7c62] py-24 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl font-serif italic">The Heart of the Game</h2>
          <p className="text-sm tracking-[0.1em] leading-loose opacity-90">
             "We didn't just want to build a brand, we wanted to build a tribute to the game 
             that raised us. Golf is a game built on history and tradition, and the goal is to keep
             those two elements alive."
          - Kyle Kasitz, Founder of heather&hickory
          </p>
        </div>
      </section>
    </main>
  );
}