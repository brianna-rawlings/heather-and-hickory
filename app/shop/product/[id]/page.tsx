'use client';
import { use, useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface Variation {
  id: string;
  name: string;
  price: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  images?: string[];
  variations?: Variation[];
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addItem, setIsOpen } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/catalog')
      .then(res => res.json())
      .then(data => {
        const found = data.products?.find((p: Product) => p.id === id);
        if (found) {
          setProduct(found);
          setActiveImage(found.images?.[0] || found.image);
        } else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product || !selectedSize) return;
    addItem({
      ...product,
      name: `${product.name} (${selectedSize})`,
      variationId: selectedVariationId || undefined,
    });
    setAdded(true);
    setIsOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const allImages = product
    ? Array.from(new Set([...(product.images || []), product.image])).filter(Boolean)
    : [];

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-32">
        <div className="max-w-5xl mx-auto px-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="aspect-[3/4] bg-gray-100" />
            <div className="space-y-4 pt-8">
              <div className="h-3 bg-gray-100 w-1/3" />
              <div className="h-8 bg-gray-100 w-2/3" />
              <div className="h-4 bg-gray-100 w-1/4" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-white pt-40 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-serif italic text-[#4c2a17] mb-4">Product not found</h1>
        <Link href="/shop/shop-all" className="bg-[#4c2a17] text-white px-10 py-4 text-xs uppercase tracking-[0.3em] hover:bg-[#435e48] transition-colors mt-6">
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-32">
      <div className="max-w-5xl mx-auto px-6 pb-24">

        {/* Breadcrumb */}
        <nav className="mb-10 text-[10px] uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-[#4c2a17] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop/shop-all" className="hover:text-[#4c2a17] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#4c2a17]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* LEFT: Image Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails — only show if more than 1 image */}
            {allImages.length > 1 && (
              <div className="flex flex-col gap-2 w-16 flex-shrink-0">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === img ? 'border-[#4c2a17]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 aspect-[3/4] bg-gray-100 overflow-hidden">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-3">{product.category}</p>
            <h1 className="text-4xl font-serif text-[#4c2a17] mb-4">{product.name}</h1>
            <p className="text-lg font-semibold text-[#435e48] mb-10">
              {selectedVariationId && product.variations
                ? product.variations.find(v => v.id === selectedVariationId)?.price || product.price
                : product.price}
            </p>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">Select Size</p>
                {!selectedSize && (
                  <p className="text-[10px] text-red-400 uppercase tracking-[0.15em]">Required</p>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(product.variations && product.variations.length > 0
                  ? product.variations
                  : ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => ({ id: s, name: s, price: product.price }))
                ).map(variation => (
                  <button
                    key={variation.id}
                    onClick={() => { setSelectedSize(variation.name); setSelectedVariationId(variation.id); }}
                    className={`py-3 text-xs uppercase tracking-[0.2em] border transition-all duration-200 ${
                      selectedSize === variation.name
                        ? 'border-[#4c2a17] bg-[#4c2a17] text-white'
                        : 'border-gray-200 text-gray-600 hover:border-[#4c2a17] hover:text-[#4c2a17]'
                    }`}
                  >
                    {variation.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Bag */}
            <button
              onClick={handleAdd}
              disabled={!selectedSize}
              className={`w-full py-4 text-xs uppercase tracking-[0.3em] transition-all duration-300 ${
                !selectedSize
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-[#435e48] text-white'
                  : 'bg-[#4c2a17] text-white hover:bg-[#435e48]'
              }`}
            >
              {added ? '✓ Added to Bag' : 'Add to Bag'}
            </button>

            <p className="mt-4 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
              Free exchanges on sizing · 30 day returns
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}