'use client';
import { useState, useEffect } from 'react';

interface Order {
  id: string;
  shortId: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  items: { name: string; quantity: string; price: string }[];
  total: string;
  status: string;
  fulfillmentStatus: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('USPS');
  const [shippingStatus, setShippingStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [shippingMessage, setShippingMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'completed' | 'manual' | 'codes'>('orders');

  // Manual shipping confirmation fields
  const [manualOrderId, setManualOrderId] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualTracking, setManualTracking] = useState('');
  const [manualCarrier, setManualCarrier] = useState('USPS');
  const [manualStatus, setManualStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [manualMessage, setManualMessage] = useState('');

  const handleAuth = () => {
    if (password === 'Br20042004!') {
      setAuthenticated(true);
      setAuthError('');
      fetchOrders();
    } else {
      setAuthError('Incorrect password');
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      console.error('Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCreateLabel = (order: Order) => {
    window.open(`https://squareup.com/dashboard/orders/overview/${order.id}`, '_blank');
  };

  const handleSendShipping = async (order: Order) => {
    if (!trackingNumber) return;
    setShippingStatus('sending');
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.shortId,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          trackingNumber,
          carrier,
        }),
      });
      if (res.ok) {
        setShippingStatus('success');
        setShippingMessage(`Shipping confirmation sent to ${order.customerEmail}`);
        setTrackingNumber('');
        setSelectedOrder(null);
      } else {
        setShippingStatus('error');
        setShippingMessage('Failed to send. Please try again.');
      }
    } catch {
      setShippingStatus('error');
      setShippingMessage('Something went wrong.');
    }
  };

  const handleManualSubmit = async () => {
    if (!manualOrderId || !manualEmail || !manualName || !manualTracking) return;
    setManualStatus('sending');
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: manualOrderId,
          customerEmail: manualEmail,
          customerName: manualName,
          trackingNumber: manualTracking,
          carrier: manualCarrier,
        }),
      });
      if (res.ok) {
        setManualStatus('success');
        setManualMessage(`Shipping confirmation sent to ${manualEmail}`);
        setManualOrderId('');
        setManualEmail('');
        setManualName('');
        setManualTracking('');
      } else {
        setManualStatus('error');
        setManualMessage('Failed to send. Please try again.');
      }
    } catch {
      setManualStatus('error');
      setManualMessage('Something went wrong.');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#f9f7f4] flex items-center justify-center px-6">
        <div className="bg-white p-10 max-w-sm w-full">
          <h1 className="text-2xl font-serif italic text-[#4c2a17] mb-2">Admin</h1>
          <div className="h-0.5 w-12 bg-[#435e48] mb-8"></div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] mb-4"
            placeholder="Enter password"
          />
          {authError && <p className="text-red-400 text-xs mb-4">{authError}</p>}
          <button onClick={handleAuth} className="w-full bg-[#4c2a17] text-white py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#435e48] transition-colors">
            Enter
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f7f4] pt-50 px-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-serif italic text-[#4c2a17]">heather & hickory</h1>
          <button onClick={fetchOrders} className="text-xs uppercase tracking-[0.2em] text-[#435e48] hover:text-[#4c2a17] transition-colors">
            ↻ Refresh
          </button>
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#435e48] mb-2">Admin Panel</p>
        <div className="h-0.5 w-16 bg-[#435e48] mb-8"></div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          {[
           { id: 'orders', label: 'Orders' },
           { id: 'completed', label: 'Completed' },
           { id: 'manual', label: 'Manual Shipping' },
           { id: 'codes', label: 'Discount Codes' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-[#4c2a17] text-[#4c2a17] font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="bg-white p-8 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-8 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">No orders yet</p>
              </div>
            ) : (
              
              orders.filter(o => o.status !== 'COMPLETED').map(order => (
                <div key={order.id} className="bg-white p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">{formatDate(order.createdAt)}</p>
                      <h3 className="text-sm font-bold text-[#4c2a17]">Order #{order.shortId}</h3>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-[#435e48]">{order.total}</p>
                      <span className={`text-[10px] uppercase tracking-[0.15em] px-2 py-1 ${
                        order.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border-t border-gray-100 pt-3 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs text-gray-500 py-1">
                        <span>{item.name} × {item.quantity}</span>
                        <span>{item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  {order.address.line1 && (
                    <div className="border-t border-gray-100 pt-3 mb-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Ship To</p>
                      <p className="text-xs text-gray-600">
                        {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
                        {order.address.city}, {order.address.state} {order.address.zip}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleCreateLabel(order)}
                      className="flex-1 py-3 text-xs uppercase tracking-[0.2em] bg-[#435e48] text-white hover:bg-[#4c2a17] transition-colors"
                    >
                      Create Label →
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShippingStatus('idle');
                        setShippingMessage('');
                      }}
                      className="flex-1 py-3 text-xs uppercase tracking-[0.2em] border border-[#4c2a17] text-[#4c2a17] hover:bg-[#4c2a17] hover:text-white transition-colors"
                    >
                      Send Tracking
                    </button>
                  </div>

                  {/* Send Tracking Inline */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Carrier</label>
                          <select value={carrier} onChange={e => setCarrier(e.target.value)}
                            className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#4c2a17] bg-white">
                            <option>USPS</option>
                            <option>UPS</option>
                            <option>FedEx</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Tracking #</label>
                          <input
                            type="text"
                            value={trackingNumber}
                            onChange={e => setTrackingNumber(e.target.value)}
                            className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#4c2a17]"
                            placeholder="Enter tracking number"
                          />
                        </div>
                      </div>
                      {shippingMessage && (
                        <p className={`text-xs ${shippingStatus === 'success' ? 'text-[#435e48]' : 'text-red-400'}`}>{shippingMessage}</p>
                      )}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSendShipping(order)}
                          disabled={!trackingNumber || shippingStatus === 'sending'}
                          className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${
                            !trackingNumber ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#4c2a17] text-white hover:bg-[#435e48]'
                          }`}
                        >
                          {shippingStatus === 'sending' ? 'Sending...' : 'Send Confirmation Email'}
                        </button>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* COMPLETED TAB */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {orders.filter(o => o.status === 'COMPLETED').length === 0 ? (
              <div className="bg-white p-8 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">No completed orders yet</p>
              </div>
            ) : (
              orders.filter(o => o.status === 'COMPLETED').map(order => (
                <div key={order.id} className="bg-white p-6 opacity-60">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">{formatDate(order.createdAt)}</p>
                      <h3 className="text-sm font-bold text-[#4c2a17]">Order #{order.shortId}</h3>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-[#435e48]">{order.total}</p>
                      <span className="text-[10px] uppercase tracking-[0.15em] px-2 py-1 bg-green-50 text-green-600">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs text-gray-500 py-1">
                        <span>{item.name} × {item.quantity}</span>
                        <span>{item.price}</span>
                      </div>
                    ))}
                  </div>
                  {order.address.line1 && (
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Shipped To</p>
                      <p className="text-xs text-gray-600">
                        {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
                        {order.address.city}, {order.address.state} {order.address.zip}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* MANUAL SHIPPING TAB */}

        {/* MANUAL SHIPPING TAB */}
        {activeTab === 'manual' && (
          <div className="bg-white p-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Manual Shipping Confirmation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Order ID</label>
                <input type="text" value={manualOrderId} onChange={e => setManualOrderId(e.target.value)}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17]"
                  placeholder="e.g. HH123456" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Customer Name</label>
                <input type="text" value={manualName} onChange={e => setManualName(e.target.value)}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17]"
                  placeholder="Jane Smith" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Customer Email</label>
                <input type="email" value={manualEmail} onChange={e => setManualEmail(e.target.value)}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17]"
                  placeholder="jane@email.com" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Carrier</label>
                <select value={manualCarrier} onChange={e => setManualCarrier(e.target.value)}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17] bg-white">
                  <option>USPS</option>
                  <option>UPS</option>
                  <option>FedEx</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Tracking Number</label>
                <input type="text" value={manualTracking} onChange={e => setManualTracking(e.target.value)}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#4c2a17]"
                  placeholder="1Z999AA10123456784" />
              </div>
            </div>
            {manualMessage && (
              <p className={`mt-4 text-xs ${manualStatus === 'success' ? 'text-[#435e48]' : 'text-red-400'}`}>{manualMessage}</p>
            )}
            <button
              onClick={handleManualSubmit}
              disabled={!manualOrderId || !manualEmail || !manualName || !manualTracking || manualStatus === 'sending'}
              className={`w-full mt-6 py-4 text-xs uppercase tracking-[0.3em] transition-all duration-300 ${
                !manualOrderId || !manualEmail || !manualName || !manualTracking
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : manualStatus === 'sending'
                  ? 'bg-[#435e48] text-white'
                  : 'bg-[#4c2a17] text-white hover:bg-[#435e48]'
              }`}
            >
              {manualStatus === 'sending' ? 'Sending...' : 'Send Shipping Confirmation'}
            </button>
          </div>
        )}

        {/* DISCOUNT CODES TAB */}
        {activeTab === 'codes' && (
          <div className="bg-white p-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#4c2a17] font-bold mb-6">Active Discount Codes</h2>
            <div className="space-y-4">
              {[
                { code: 'HHFREESHIP', desc: 'Free standard shipping' },
                { code: 'TAYLOR10', desc: '10% off + free shipping' },
                { code: 'HICKORY10', desc: '10% off' },
              ].map(({ code, desc }) => (
                <div key={code} className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-[#4c2a17]">{code}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#435e48]">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}