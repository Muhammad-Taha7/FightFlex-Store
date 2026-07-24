import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../../store/orderSlice';
import { Package, Clock, MapPin, CreditCard, AlertCircle, ShoppingBag } from 'lucide-react';

const statusColors = {
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  confirmed: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  processing: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  shipped: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  delivered: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  cancelled: { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700' },
};

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    dispatch(fetchUserOrders());
  }, [dispatch, isAuthenticated, navigate]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="min-h-screen pt-[5rem] md:pt-[7rem] w-full bg-slate-950 text-slate-100 py-8 px-4 sm:px-8 lg:px-12">
      <div className="w-full">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <Package size={24} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">My Orders</h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-400 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          
          /* Empty State */
          <div className="w-full bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <ShoppingBag size={44} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[280px] mb-8 font-medium">
              You haven't placed any orders yet. Start shopping and your orders will appear here.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white border-none px-8 py-3.5 rounded-2xl text-sm font-bold cursor-pointer hover:bg-blue-500 transition-colors duration-200 shadow-lg shadow-blue-600/20"
            >
              Browse Products
            </button>
          </div>
        ) : (
          
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => {
              const sc = statusColors[order.status] || statusColors.pending;
              return (
                <div 
                  key={order._id}
                  className="w-full bg-slate-900 border border-slate-800 shadow-xl rounded-3xl overflow-hidden transition-all duration-300"
                >
                  {/* Order Header */}
                  <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/60">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-500" />
                          {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex px-3.5 py-1.5 rounded-full text-xs font-extrabold capitalize border ${sc.bg} ${sc.text} ${sc.border}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-800/60 last:border-none">
                        <div className="flex items-center gap-4">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-12 h-12 rounded-2xl object-cover bg-slate-950 border border-slate-800" 
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                              <Package size={20} className="text-slate-500" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-white">{item.name}</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                              Qty: {item.quantity}
                              {item.size && ` · ${item.size}`}
                              {item.color && ` · ${item.color}`}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-extrabold text-white">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="px-5 sm:px-6 py-4 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-800">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                      {order.shippingAddress && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-500" /> {order.shippingAddress}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CreditCard size={13} className="text-slate-500" /> {order.paymentMethod || 'COD'}
                      </span>
                    </div>
                    <p className="text-lg font-black text-blue-400">
                      Total: Rs. {order.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;