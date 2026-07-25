import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Package, Search, Calendar, Filter, Eye, Loader2, ArrowUpDown, Download, X, CheckCircle, XCircle, AlertCircle, CreditCard, MapPin, User } from 'lucide-react';

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
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
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
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
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

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, day, week, month, year
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Dialog state
  const [dialog, setDialog] = useState({ open: false, type: 'info', title: '', message: '', onConfirm: null, confirmText: '', cancelText: '' });

  const showDialog = (type, title, message, onConfirm = null, confirmText = '', cancelText = '') => {
    setDialog({ open: true, type, title, message, onConfirm, confirmText, cancelText });
  };

  const closeDialog = () => setDialog({ ...dialog, open: false });

  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    let intervalId;
    const fetchOrders = async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { filter }
        };
        const res = await axios.get('http://localhost:5000/api/orders/all', config);
        setOrders(res.data.orders);
      } catch (error) {
        console.error('Error fetching admin orders:', error);
      } finally {
        if (!silent) setLoading(false);
      }
    };
    
    if (token) {
      fetchOrders();
      intervalId = setInterval(() => fetchOrders(true), 30000); // Silent refresh every 30s
    }
    
    return () => {
        if (intervalId) clearInterval(intervalId);
    };
  }, [token, filter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, config);
      // Update local state
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      showDialog('success', 'Status Updated', `Order has been marked as "${newStatus}" successfully.`);
    } catch (error) {
      console.error('Error updating order status:', error);
      showDialog('error', 'Update Failed', error.response?.data?.message || 'Failed to update order status. Please try again.');
    }
  };

  const confirmStatusUpdate = (orderId, newStatus) => {
    let msg = '';
    let btnText = '';
    
    if (newStatus === 'cleared') {
      msg = 'This will mark the order as cleared/delivered. The customer will be notified.';
      btnText = 'Clear Order';
    } else if (newStatus === 'dispatched') {
      msg = 'This will mark the order as dispatched. The customer can now track it.';
      btnText = 'Dispatch Order';
    } else if (newStatus === 'cancelled') {
      msg = 'This will cancel the order. The customer will be notified.';
      btnText = 'Cancel Order';
    } else if (newStatus === 'pending') {
      msg = 'Revert this order back to pending state?';
      btnText = 'Mark Pending';
    }
    
    showDialog(
      'confirm', 
      `Update Status to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}?`, 
      msg, 
      () => handleUpdateStatus(orderId, newStatus),
      btnText,
      'Go Back'
    );
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (order.user?.name && order.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (order.user?.username && order.user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDownloadCSV = () => {
    if (filteredOrders.length === 0) {
      showDialog('info', 'No Data', 'There are no orders to export for the current filter.');
      return;
    }
    
    const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'Status', 'Total Price', 'Payment Method', 'Shipping Address'];
    const rows = filteredOrders.map(order => [
      order._id,
      new Date(order.createdAt).toLocaleDateString(),
      order.user?.name || order.user?.username || 'Unknown User',
      order.user?.email || 'N/A',
      order.phone || 'N/A',
      order.status,
      order.totalPrice,
      order.paymentMethod || 'COD',
      `"${(typeof order.shippingAddress === 'string' ? order.shippingAddress : order.shippingAddress?.address || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showDialog('success', 'Export Complete', `${filteredOrders.length} orders have been exported to CSV successfully.`);
  };

  // Count stats
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const dispatchedCount = orders.filter(o => o.status === 'dispatched').length;
  const clearedCount = orders.filter(o => o.status === 'cleared').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  return (
    <div className="space-y-6">

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold uppercase">Total</p>
          <p className="text-2xl font-black text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-amber-600 font-semibold uppercase">Pending</p>
          <p className="text-2xl font-black text-amber-700">{pendingCount}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-900 font-semibold uppercase">Dispatched</p>
          <p className="text-2xl font-black text-black">{dispatchedCount}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-xs text-emerald-600 font-semibold uppercase">Cleared</p>
          <p className="text-2xl font-black text-emerald-700">{clearedCount}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-xs text-red-600 font-semibold uppercase">Cancelled</p>
          <p className="text-2xl font-black text-red-700">{cancelledCount}</p>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
        
        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto hide-scrollbar">
          {['all', 'day', 'week', 'month', 'year'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all capitalize whitespace-nowrap ${
                filter === f 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {f === 'day' ? 'Today' : f === 'all' ? 'All Time' : `This ${f}`}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Order ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800/20 focus:border-gray-800 transition-all text-sm"
            />
          </div>
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-gray-900 text-white hover:bg-black px-4 py-2.5 rounded-xl font-semibold transition text-sm whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-900 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total Price</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-900 mx-auto" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No orders found for the selected filter.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.user?.name || order.user?.username || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email || ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Rs {order.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {order.paymentMethod || 'COD'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        order.status === 'cleared' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        order.status === 'dispatched' ? 'bg-gray-100 text-black border border-gray-200' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select 
                          value={order.status}
                          onChange={(e) => {
                            if (e.target.value !== order.status) {
                              confirmStatusUpdate(order._id, e.target.value);
                            }
                          }}
                          className={`text-xs font-bold rounded-lg px-2 py-1.5 border outline-none transition-colors cursor-pointer ${
                            order.status === 'cleared' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            order.status === 'dispatched' ? 'bg-gray-50 text-black border-gray-200' :
                            order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="cleared">Cleared</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 bg-gray-50 text-gray-600 hover:bg-gray-200 hover:text-black rounded-lg transition-colors border border-gray-200 ml-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Order ID</p>
                  <p className="font-mono text-gray-900 text-sm">{selectedOrder._id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                    selectedOrder.status === 'cleared' ? 'bg-emerald-100 text-emerald-800' :
                    selectedOrder.status === 'dispatched' ? 'bg-gray-100 text-black' :
                    selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> Customer Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500 font-medium">Name:</span> <span className="text-gray-900 font-semibold">{selectedOrder.user?.name || selectedOrder.user?.username || 'N/A'}</span></p>
                    <p><span className="text-gray-500 font-medium">Email:</span> <span className="text-gray-900">{selectedOrder.user?.email || 'N/A'}</span></p>
                    <p><span className="text-gray-500 font-medium">Phone:</span> <span className="text-gray-900">{selectedOrder.phone || 'N/A'}</span></p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> Shipping Address
                  </h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>{typeof selectedOrder.shippingAddress === 'string' ? selectedOrder.shippingAddress : selectedOrder.shippingAddress?.address}</p>
                    {selectedOrder.shippingAddress?.city && (
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                    )}
                    {selectedOrder.shippingAddress?.country && (
                      <p>{selectedOrder.shippingAddress.country}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Order Items ({selectedOrder.items?.length || 0})</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        {item.image || item.product?.images?.[0]?.imageUrl ? (
                          <img src={item.image || item.product?.images?.[0]?.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
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
                  <p className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" /> {selectedOrder.paymentMethod || 'COD'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Paid</p>
                  <p className="text-2xl font-black">Rs {selectedOrder.totalPrice?.toLocaleString()}</p>
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
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
      />
    </div>
  );
};

export default OrderManagement;
