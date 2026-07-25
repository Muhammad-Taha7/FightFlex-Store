import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../../store/cartSlice';
import { Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { items, totalAmount } = useSelector(state => state.cart);
  const { user, token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!token) {
    return <Navigate to="/client-login" state={{ from: '/checkout' }} replace />;
  }

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/men')} className="text-gray-900 hover:underline">Continue Shopping</button>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !shippingAddress.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, Phone, Address).');
      return;
    }
    setErrorMsg('');

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const orderData = {
        items: items.map(item => ({
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          size: item.size,
          color: item.color
        })),
        totalPrice: totalAmount,
        shippingAddress,
        paymentMethod,
        phone
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, config);
      dispatch(clearCart());
      setSuccess(true);
    } catch (error) {
      console.error('Failed to place order:', error);
      setErrorMsg('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-8">Thank you for your purchase. We'll start processing your order immediately.</p>
          <button 
            onClick={() => navigate('/orders')}
            className="w-full py-4 px-6 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 uppercase">Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Form Section */}
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Details</h2>
            
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-3">
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    required
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input 
                  type="text" 
                  required
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 3XX XXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Complete Shipping Address *</label>
                <textarea 
                  required
                  rows="4"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House #, Street, Area, City..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <div className="flex gap-4">
                  <label className={`flex-1 border p-4 rounded-xl cursor-pointer flex items-center justify-center font-bold transition-all ${paymentMethod === 'COD' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="COD" 
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="hidden"
                    />
                    Cash on Delivery
                  </label>
                  {/* For visual purposes only, can implement stripe later */}
                  <label className="flex-1 border border-gray-200 p-4 rounded-xl cursor-not-allowed flex items-center justify-center font-bold text-gray-400 bg-gray-50">
                    Credit Card (Soon)
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `Place Order - Rs ${totalAmount.toLocaleString()}`}
              </button>

            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} | {item.size} {item.color}</p>
                      <p className="font-bold mt-1">Rs {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">Rs {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-extrabold text-black">Rs {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
                Secure Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
