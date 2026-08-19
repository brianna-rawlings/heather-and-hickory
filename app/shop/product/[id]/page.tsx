'use client';
import { use, useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import ProductCarousel from '@/components/ProductCarousel';
import { getSale } from '@/lib/sale';

interface Variation {
  id: string;
  name: string;
  price: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  images?: string[];
  description?: string;
  totalStock: number;
  variations?: Variation[];
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-[10px] uppercase tracking-[0.25em] text-[#4c2a17] font-bold"
      >
        {title}
        <span className="text-lg leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed" style={{ color: '#435e48' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addItem, setIsOpen } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch('/api/catalog')
      .then(res => res.json())
      .then(data => {
        const found = data.products?.find((p: Product) => p.id === id);
        if (found) {
          setProduct(found);
          setActiveImage(found.images?.[0] || found.image);
        } else setError(true);
        setAllProducts(data.products || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product || !selectedSize) return;
    const selectedVariation = product.variations?.find(v => v.id === selectedVariationId);
    const availableStock = selectedVariation?.stock ?? 999;
    if (quantity > availableStock) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        ...product,
        name: `${product.name} (${selectedSize})`,
        variationId: selectedVariationId || undefined,
      });
    }
    setAdded(true);
    setIsOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const allImages = product
    ? Array.from(new Set([...(product.images || []), product.image])).filter(Boolean)
    : [];

  const descriptionParts = product?.description?.split('---') || [];
  const mainDescription = descriptionParts[0]?.trim() || '';
  const materials = descriptionParts[1]?.trim() || '';

  const selectedVariation = product?.variations?.find(v => v.id === selectedVariationId);
  const selectedStock = selectedVariation?.stock ?? 999;
  const isOutOfStock = selectedSize ? selectedStock === 0 : product?.totalStock === 0;

  const sale = product ? getSale(product.name) : undefined;
  const rawPrice = selectedVariationId && product?.variations
    ? product.variations.find(v => v.id === selectedVariationId)?.price || product.price
    : product?.price || '$0.00';
  const rawPriceValue = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
  const displayPriceValue = sale ? rawPriceValue * (1 - sale.percentOff / 100) : rawPriceValue;

  const similarProducts = product ? [
    ...allProducts.filter(p => p.id !== id && p.category === product.category),
    ...allProducts.filter(p => p.id !== id && p.category !== product.category),
  ] : [];

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-40">
        <div className="max-w-5xl mx-auto px-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
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
    <main className="min-h-screen bg-white pt-40">
      <div className="max-w-5xl mx-auto px-6 pb-24">

        {/* Breadcrumb */}
        <nav className="mb-10 text-[10px] uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-[#4c2a17] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop/shop-all" className="hover:text-[#4c2a17] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#4c2a17]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* LEFT: Image Gallery */}
          <div className="flex gap-4">
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
            <div className="flex-1 aspect-[3/4] bg-gray-100 overflow-hidden relative">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const currentIdx = allImages.indexOf(activeImage || product.image);
                      setActiveImage(allImages[currentIdx === 0 ? allImages.length - 1 : currentIdx - 1]);
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white text-2xl font-bold drop-shadow-lg"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => {
                      const currentIdx = allImages.indexOf(activeImage || product.image);
                      setActiveImage(allImages[currentIdx === allImages.length - 1 ? 0 : currentIdx + 1]);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white text-2xl font-bold drop-shadow-lg"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="flex flex-col justify-start pt-4">
            <div className="flex items-center gap-3 mb-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">{product.category}</p>
              {sale && (
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#435e48]">{sale.label}</span>
              )}
            </div>
            <h1 className="text-4xl font-serif text-[#4c2a17] mb-4">{product.name}</h1>
            <div className="flex items-baseline gap-3 mb-6">
              {sale && (
                <span className="text-base text-gray-400 line-through">{rawPrice}</span>
              )}
              <p className="text-lg font-semibold text-[#435e48]">${displayPriceValue.toFixed(2)}</p>
            </div>

            {/* Out of stock banner */}
            {product.totalStock === 0 && (
              <div className="mb-6 py-3 px-4 bg-gray-100 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Out of Stock</p>
              </div>
            )}

            {/* Main Description */}
            {mainDescription && (
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#435e48' }}>{mainDescription}</p>
            )}

            {/* Size Selection */}
            {product.totalStock > 0 && (
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
                    : ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => ({ id: s, name: s, price: product.price, stock: 999 }))
                  ).map(variation => {
                    const outOfStock = variation.stock === 0;
                    return (
                      <button
                        key={variation.id}
                        onClick={() => {
                          if (outOfStock) return;
                          setSelectedSize(variation.name);
                          setSelectedVariationId(variation.id);
                          setQuantity(1);
                        }}
                        disabled={outOfStock}
                        className={`py-3 text-xs uppercase tracking-[0.2em] border transition-all duration-200 relative ${
                          outOfStock
                            ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                            : selectedSize === variation.name
                            ? 'border-[#4c2a17] bg-[#4c2a17] text-white'
                            : 'border-gray-200 text-gray-600 hover:border-[#4c2a17] hover:text-[#4c2a17]'
                        }`}
                      >
                        {variation.name}
                        {outOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-px bg-gray-300 rotate-45 absolute"></span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedSize && selectedStock > 0 && selectedStock <= 5 && (
                  <p className="mt-2 text-xs text-amber-500 uppercase tracking-[0.15em]">Only {selectedStock} left!</p>
                )}
              </div>
            )}

            {/* Quantity */}
            {product.totalStock > 0 && selectedSize && (
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold mb-4">Quantity</p>
                <div className="flex items-center border border-gray-200 w-fit">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-[#4c2a17] hover:bg-gray-50 transition-colors text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 text-sm text-[#4c2a17] border-x border-gray-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(selectedStock, q + 1))}
                    className="px-4 py-3 text-[#4c2a17] hover:bg-gray-50 transition-colors text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Bag */}
            <button
              onClick={handleAdd}
              disabled={!selectedSize || isOutOfStock || product.totalStock === 0}
              className={`w-full py-4 text-xs uppercase tracking-[0.3em] transition-all duration-300 mb-4 ${
                product.totalStock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : !selectedSize
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-[#435e48] text-white'
                  : 'bg-[#4c2a17] text-white hover:bg-[#435e48]'
              }`}
            >
              {product.totalStock === 0 ? 'Out of Stock' : added ? '✓ Added to Bag' : 'Add to Bag'}
            </button>

            {/* Accordion Sections */}
            <div className="mt-2">
              {materials && (
                <Accordion title="Design & Materials">
                  <p>{materials}</p>
                </Accordion>
              )}
              <Accordion title="Shipping & Returns">
                <p className="mb-2">Standard shipping: $6 (5–7 business days)</p>
                <p className="mb-2">Expedited shipping: $14 (2–3 business days)</p>
                <p className="mb-2">Free shipping on orders over $50.</p>
                <p>We accept returns within 30 days of purchase on unworn items with tags attached. Free size exchanges — just reach out to heatherandhickory@gmail.com.</p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {similarProducts.length > 0 && (
        <section className="border-t border-gray-100 py-16" style={{ backgroundColor: '#f9f7f4' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <h2 className="text-3xl font-serif italic text-[#4c2a17]">You May Also Like</h2>
              <div className="h-0.5 w-16 bg-[#435e48] mt-3"></div>
            </div>
            <div className="group">
              <ProductCarousel products={similarProducts} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}