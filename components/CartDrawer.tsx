'use client';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { getSale } from '@/lib/sale';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems } = useCart();
  const router = useRouter();

  const getItemPricing = (item: { name: string; price: string }) => {
    const original = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    const sale = getSale(item.name);
    const effective = sale ? original * (1 - sale.percentOff / 100) : original;
    return { original, effective, sale };
  };

  const subtotal = items.reduce((sum, item) => {
    const { effective } = getItemPricing(item);
    return sum + effective * item.quantity;
  }, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-400 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} strokeWidth={1.2} className="text-[#4c2a17]" />
            <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-[#4c2a17]">
              Your Bag ({totalItems})
            </h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-[#4c2a17] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-4">
              <ShoppingBag size={48} strokeWidth={0.8} />
              <p className="text-sm uppercase tracking-[0.2em]">Your bag is empty</p>
            </div>
          ) : (
            items.map(item => {
              const { effective, sale } = getItemPricing(item);
              return (
                <div key={`${item.id}-${item.variationId ?? ''}`} className="flex gap-4">
                  <div className="w-24 h-28 bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{item.category}</p>
                        {sale && (
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#435e48]">{sale.label}</p>
                        )}
                      </div>
                      <h3 className="text-sm font-serif text-[#4c2a17]">{item.name}</h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        {sale && (
                          <p className="text-xs text-gray-400 line-through">{item.price}</p>
                        )}
                        <p className="text-sm text-[#435e48] font-semibold">${effective.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 border border-gray-200 px-3 py-1">
                        <button onClick={() => updateQuantity(item.id, item.variationId, item.quantity - 1)} className="text-gray-400 hover:text-[#4c2a17] transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.variationId, item.quantity + 1)} className="text-gray-400 hover:text-[#4c2a17] transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id, item.variationId)} className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-red-400 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Subtotal</span>
              <span className="text-sm font-semibold text-[#4c2a17]">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-gray-400 text-center">Shipping & taxes calculated at checkout</p>
            <button
              onClick={() => { setIsOpen(false); router.push('/checkout'); }}
              className="w-full bg-[#4c2a17] text-white py-4 text-xs uppercase tracking-[0.3em] hover:bg-[#435e48] transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full border border-gray-200 text-[#4c2a17] py-3 text-xs uppercase tracking-[0.3em] hover:border-[#4c2a17] transition-colors duration-300"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}