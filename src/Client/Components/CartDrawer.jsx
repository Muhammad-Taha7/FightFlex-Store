import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../../store/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, totalQuantity } = useSelector((state) => state.cart);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-[101] transform transition-transform flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-black" />
            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2">
              {totalQuantity}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="text-lg font-medium text-gray-500">Your cart is empty.</p>
              <button 
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={`${item._id}-${item.size}-${item.color}-${index}`} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl">
                  
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                    <div className="text-xs text-gray-500 mt-1 space-x-2">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div className="font-bold text-black mt-2">Rs {item.price.toLocaleString()}</div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full space-y-4">
                    <button 
                      onClick={() => dispatch(removeFromCart(item))}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                      <button 
                        onClick={() => dispatch(decreaseQuantity(item))}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(increaseQuantity(item))}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-2xl font-extrabold text-black">Rs {totalAmount.toLocaleString()}</span>
            </div>
            
            <button
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full flex items-center justify-center py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-900 transition-all transform active:scale-[0.98] shadow-xl shadow-black/20"
            >
              Checkout <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
