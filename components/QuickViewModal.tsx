'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface Props {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: Props) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem({ ...product, name: `${product.name} (${selectedSize})` });
    setAdded(true);
    setTimeout(() => {
      onClose();
      setAdded(false);
    }, 800);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white w-full max-w-2xl flex flex-col md:flex-row overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Image */}
          <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto bg-gray-100 overflow-hidden flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 p-8 flex flex-col justify-between relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-300 hover:text-[#4c2a17] transition-colors"
            >
              <X size={20} />
            </button>

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">{product.category}</p>
              <h2 className="text-2xl font-serif text-[#4c2a17] mb-2">{product.name}</h2>
              <p className="text-base font-semibold text-[#435e48] mb-8">{product.price}</p>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold">Select Size</p>
                  {!selectedSize && (
                    <p className="text-[10px] text-red-400 uppercase tracking-[0.15em]">Required</p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-xs uppercase tracking-[0.2em] border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-[#4c2a17] bg-[#4c2a17] text-white'
                          : 'border-gray-200 text-gray-600 hover:border-[#4c2a17] hover:text-[#4c2a17]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Add to Bag Button */}
            <button
              onClick={handleAdd}
              disabled={!selectedSize}
              className={`mt-8 w-full py-4 text-xs uppercase tracking-[0.3em] transition-all duration-300 ${
                !selectedSize
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-[#435e48] text-white'
                  : 'bg-[#4c2a17] text-white hover:bg-[#435e48]'
              }`}
            >
              {added ? '✓ Added to Bag' : 'Add to Bag'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}