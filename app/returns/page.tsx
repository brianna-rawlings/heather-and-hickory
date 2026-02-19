export default function ReturnsPage() {
    return (
      <main className="min-h-screen bg-white pt-50">
        <div className="max-w-3xl mx-auto px-6 pb-24">
          <header className="mb-16 text-center">
            <h1 className="text-5xl font-serif italic text-[#4c2a17] mb-4">Returns & Exchanges</h1>
            <div className="h-0.5 w-24 bg-[#435e48] mx-auto"></div>
          </header>
  
          <div className="space-y-12 text-gray-600 text-sm leading-relaxed">
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">Our Policy</h2>
              <p>
                We want you to love what you ordered. If something isn't right, we're here to make it easy. 
                All returns and exchanges must be requested within <strong className="text-[#4c2a17]">30 days</strong> of 
                your delivery date.
              </p>
            </div>
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">Returns</h2>
              <p className="mb-3">
                Items may be returned for a full refund to your original payment method, provided they are:
              </p>
              <ul className="space-y-2 list-none">
                {['Unworn and unwashed', 'In original condition with all tags attached', 'Returned within 30 days of delivery'].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#435e48] mt-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Refunds are processed within <strong className="text-[#4c2a17]">5–7 business days</strong> of 
                receiving your return. You will be notified by email once your refund has been issued.
              </p>
            </div>
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">Exchanges</h2>
              <p>
                Need a different size? We offer <strong className="text-[#4c2a17]">free size exchanges</strong> within 
                30 days of delivery. Simply contact us with your order details and the size you need, and we'll 
                get a new one out to you as soon as we receive your return. We cover the shipping back to you.
              </p>
            </div>
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">Return Shipping</h2>
              <p>
                Customers are responsible for return shipping costs. We recommend using a trackable shipping 
                method as we are not responsible for items lost in transit. Original shipping charges are 
                non-refundable.
              </p>
            </div>
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">Final Sale Items</h2>
              <p>
                All discounted and sale items are <strong className="text-[#4c2a17]">final sale</strong> and are 
                not eligible for return or exchange. This will be clearly marked on the product page.
              </p>
            </div>
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">How to Start a Return or Exchange</h2>
              <p>
                Email us at{' '}
                <a href="mailto:hello@heatherandhickory.com" className="text-[#435e48] border-b border-[#435e48] hover:text-[#4c2a17] hover:border-[#4c2a17] transition-colors">
                  heatherandhickory@gmail.com
                </a>{' '}
                with your order number and reason for return or exchange. We'll respond within 1–2 business 
                days with next steps.
              </p>
            </div>
  
          </div>
        </div>
      </main>
    );
  }