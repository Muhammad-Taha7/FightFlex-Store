import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../../store/orderSlice';
import { Package, Clock, MapPin, CreditCard, AlertCircle, Eye, X, CheckCircle, XCircle, Truck, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const statusColors = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
  dispatched: { bg: 'bg-gray-100', text: 'text-black', border: 'border-gray-200', icon: Truck },
  cleared: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', icon: CheckCircle },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: XCircle }
};

// Reusable Dialog Component
const DialogBox = ({ open, onClose, type = 'info', title, message, onConfirm, confirmText, cancelText }) => {
  if (!open) return null;

  const icons = {
    success: <CheckCircle className="w-16 h-16 text-emerald-500" />,
    error: <XCircle className="w-16 h-16 text-red-500" />,
    confirm: <AlertCircle className="w-16 h-16 text-amber-500" />,
    info: <Package className="w-16 h-16 text-gray-800" />,
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl animate-[scaleIn_0.2s_ease-out]">
        <div className="flex justify-center mb-5">
          {icons[type]}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                {cancelText || 'Cancel'}
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-colors ${
                  type === 'confirm' 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-900 text-white hover:bg-black'
                }`}
              >
                {confirmText || 'Confirm'}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.orders);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [dialog, setDialog] = useState({ open: false, type: 'info', title: '', message: '', onConfirm: null });

  const showDialog = (type, title, message, onConfirm = null) => {
    setDialog({ open: true, type, title, message, onConfirm });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, open: false });
  };

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


  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  return (
    <div className="min-h-screen pt-[5rem] md:pt-[7rem] w-full bg-gray-50 text-slate-900 py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-800/10 text-gray-900 border border-gray-800/20 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>
              <p className="text-gray-500 text-sm mt-0.5">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto hide-scrollbar">
            {['all', 'pending', 'dispatched', 'cleared', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  statusFilter === status 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 text-sm font-medium">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{statusFilter !== 'all' ? `No ${statusFilter} orders` : 'No orders yet'}</h3>
            <p className="text-gray-500 mb-6 text-sm">
              {statusFilter !== 'all' ? 'Try selecting a different filter.' : 'Start exploring our products and place your first order!'}
            </p>
            {statusFilter === 'all' && (
              <button onClick={() => navigate('/')} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition">
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = statusColors[order.status]?.icon || Package;
              return (
                <div key={order._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${statusColors[order.status]?.bg} ${statusColors[order.status]?.border} border`}>
                          <StatusIcon className={`w-5 h-5 ${statusColors[order.status]?.text}`} />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-gray-900">
                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>

                      {/* Price + Status */}
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text} ${statusColors[order.status]?.border}`}>
                          {order.status}
                        </span>
                        <p className="text-lg font-black text-gray-900">Rs. {order.totalPrice?.toLocaleString()}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors border border-gray-200 font-semibold text-sm"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>

                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 overflow-x-auto">
                      {order.items?.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg min-w-fit border border-gray-100">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">{item.name}</span>
                          <span className="text-xs text-gray-400">×{item.quantity}</span>
                        </div>
                      ))}
                      {order.items?.length > 4 && (
                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">+{order.items.length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Tracking Status */}
              {selectedOrder.status !== 'cancelled' && (
                <div className="py-5 px-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-5">Order Tracking</h4>
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-4 left-[10%] w-[80%] h-0.5 bg-gray-200"></div>
                    <div className="absolute top-4 left-[10%] h-0.5 bg-emerald-500 transition-all duration-700" 
                          style={{ width: selectedOrder.status === 'cleared' ? '80%' : selectedOrder.status === 'dispatched' ? '40%' : '0%' }}></div>
                    
                    {/* Stage: Pending */}
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                        ['pending', 'dispatched', 'cleared'].includes(selectedOrder.status) 
                          ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <Clock size={16} />
                      </div>
                      <span className={`text-xs font-bold ${
                        ['pending', 'dispatched', 'cleared'].includes(selectedOrder.status) ? 'text-emerald-600' : 'text-gray-400'
                      }`}>Pending</span>
                    </div>

                    {/* Stage: Dispatched */}
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                        ['dispatched', 'cleared'].includes(selectedOrder.status) ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <Truck size={16} />
                      </div>
                      <span className={`text-xs font-bold ${
                        ['dispatched', 'cleared'].includes(selectedOrder.status) ? 'text-emerald-600' : 'text-gray-400'
                      }`}>Dispatched</span>
                    </div>

                    {/* Stage: Cleared/Delivered */}
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                        selectedOrder.status === 'cleared' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <CheckCircle size={16} />
                      </div>
                      <span className={`text-xs font-bold ${
                        selectedOrder.status === 'cleared' ? 'text-emerald-600' : 'text-gray-400'
                      }`}>Delivered</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancelled Banner */}
              {selectedOrder.status === 'cancelled' && (
                <div className="py-4 px-6 bg-red-50 rounded-2xl border border-red-200 flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-bold text-red-700">Order Cancelled</p>
                    <p className="text-red-500 text-xs">This order was cancelled and will not be processed.</p>
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Order ID</p>
                  <p className="font-mono text-gray-900 text-sm">{selectedOrder._id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-start justify-center">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${statusColors[selectedOrder.status]?.bg} ${statusColors[selectedOrder.status]?.text} ${statusColors[selectedOrder.status]?.border}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Shipping Information</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-gray-400"/> {selectedOrder.shippingAddress?.address || selectedOrder.shippingAddress}</p>
                  {selectedOrder.shippingAddress?.city && (
                    <p className="pl-5">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  )}
                  {selectedOrder.shippingAddress?.country && (
                    <p className="pl-5">{selectedOrder.shippingAddress.country}</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Purchased Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.color && `Color: ${item.color} | `} 
                          {item.size && `Size: ${item.size} | `} 
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">Rs {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Payment */}
              <div className="flex justify-between items-center bg-gray-900 text-white p-5 rounded-2xl">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Payment Method</p>
                  <p className="font-semibold flex items-center gap-2"><CreditCard size={16} /> {selectedOrder.paymentMethod || 'COD'}</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  {selectedOrder.status === 'pending' && (
                    <button 
                      onClick={() => {
                        setSelectedOrder(null);
                        confirmCancel(selectedOrder._id);
                      }}
                      className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Paid</p>
                    <p className="text-xl font-black">Rs {selectedOrder.totalPrice?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Box */}
      <DialogBox 
        open={dialog.open}
        onClose={closeDialog}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
};

export default Orders;