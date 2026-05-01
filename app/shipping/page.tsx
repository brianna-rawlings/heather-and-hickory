export default function ShippingPage() {
    return (
      <main className="min-h-screen bg-white pt-50">
        <div className="max-w-3xl mx-auto px-6 pb-24">
          <header className="mb-16 text-center">
            <h1 className="text-5xl font-serif italic text-[#4c2a17] mb-4">Shipping Policy</h1>
            <div className="h-0.5 w-24 bg-[#435e48] mx-auto"></div>
          </header>
  
          <div className="space-y-12 text-gray-600 text-sm leading-relaxed">
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">Processing Time</h2>
              <p>
                All orders are processed within <strong className="text-[#4c2a17]">2–3 business days</strong> of 
                being placed. Orders are not processed or shipped on weekends or holidays. You will receive 
                a confirmation email with tracking information once your order has shipped.
              </p>
            </div>
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">Domestic Shipping (USA)</h2>
              <div className="border border-gray-100 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-6 py-4 uppercase tracking-[0.2em] text-[#4c2a17] font-bold">Shipping Method</th>
                      <th className="text-left px-6 py-4 uppercase tracking-[0.2em] text-[#4c2a17] font-bold">Estimated Delivery</th>
                      <th className="text-left px-6 py-4 uppercase tracking-[0.2em] text-[#4c2a17] font-bold">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4">Standard Shipping</td>
                      <td className="px-6 py-4">5–7 business days</td>
                      <td className="px-6 py-4">$7.00</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Expedited Shipping</td>
                      <td className="px-6 py-4">2–3 business days</td>
                      <td className="px-6 py-4">$14.00</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Free Standard Shipping</td>
                      <td className="px-6 py-4">5–7 business days</td>
                      <td className="px-6 py-4 text-[#435e48] font-semibold">Orders over $50</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">Taylor University Campus Pickup</td>
                      <td className="px-6 py-4">Arranged via email</td>
                      <td className="px-6 py-4 text-[#435e48] font-semibold">Free</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">International Shipping</h2>
              <p>
                We currently ship within the <strong className="text-[#4c2a17]">United States only</strong>. 
                We hope to offer international shipping in the future — stay tuned!
              </p>
            </div>
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">Order Tracking</h2>
              <p>
                Once your order ships, you will receive an email with a tracking number. Please allow 
                24–48 hours for tracking information to update after receiving your shipping confirmation.
              </p>
            </div>
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">Lost or Damaged Packages</h2>
              <p>
                If your package arrives damaged or is lost in transit, please contact us at{' '}
                <a href="mailto:hello@heatherandhickory.com" className="text-[#435e48] border-b border-[#435e48] hover:text-[#4c2a17] hover:border-[#4c2a17] transition-colors">
                  heatherandhickory@gmail.com
                </a>{' '}
                within 7 days of the expected delivery date and we will work to resolve the issue promptly.
              </p>
            </div>
  
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-4">Questions?</h2>
              <p>
                If you have any questions about your order or our shipping policy, don't hesitate to reach 
                out at{' '}
                <a href="mailto:hello@heatherandhickory.com" className="text-[#435e48] border-b border-[#435e48] hover:text-[#4c2a17] hover:border-[#4c2a17] transition-colors">
                  heatherandhickory@gmail.com
                </a>. 
                We're happy to help.
              </p>
            </div>
  
          </div>
        </div>
      </main>
    );
  }