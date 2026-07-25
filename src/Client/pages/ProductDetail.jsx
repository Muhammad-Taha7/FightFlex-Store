import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../../store/cartSlice';
import { Loader2, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showDialog, setShowDialog] = useState(false);

  const showError = (message) => {
    setToastMessage(message);
    setToastType('error');
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data.product);
        if (res.data.product.images && res.data.product.images.length > 0) {
          setSelectedImage(res.data.product.images[0].imageUrl);
        }
        if (res.data.product.sizes && res.data.product.sizes.length > 0) {
          setSelectedSize(res.data.product.sizes[0]);
        }
        if (res.data.product.colors && res.data.product.colors.length > 0) {
          setSelectedColor(res.data.product.colors[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      showError('Please select a size');
      return;
    }
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      showError('Please select a color');
      return;
    }

    const item = {
      _id: product._id,
      title: product.title,
      price: product.price,
      image: selectedImage,
      size: selectedSize,
      color: selectedColor,
      quantity
    };

    dispatch(addToCart(item));
    setShowDialog(true);
    setTimeout(() => setShowDialog(false), 2500); // Auto close dialog after 2.5s
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate(-1)} className="text-gray-900 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 relative">
      
      {/* Error Toast (Keep toast only for small validation errors) */}
      {toastMessage && toastType === 'error' && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl transition-all animate-bounce bg-red-100 text-red-800 border border-red-200`}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white bg-red-500">✕</div>
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Success Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in-up transform scale-100 transition-all">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Added to Cart!</h3>
            <p className="text-gray-500 font-medium mb-8">
              {product.title} has been successfully added to your shopping cart.
            </p>
            <button 
              onClick={() => setShowDialog(false)}
              className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Images Section */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto hide-scrollbar lg:w-24 shrink-0">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`relative w-20 h-24 lg:w-full lg:h-32 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img.imageUrl ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img.imageUrl} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            <div className="flex-1 rounded-2xl overflow-hidden bg-gray-100 relative aspect-[4/5] lg:aspect-auto lg:h-[700px]">
              {selectedImage ? (
                <img src={selectedImage} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">No Image</div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="mb-2 uppercase text-sm font-semibold tracking-wider text-gray-500">{product.category}</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">{product.title}</h1>
            <p className="text-3xl font-semibold text-black mb-6">Rs {product.price.toLocaleString()}</p>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase">Select Size</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 border rounded-xl font-medium transition-all ${
                        selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-200 text-gray-900 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Select Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2 border rounded-full font-medium transition-all ${
                        selectedColor === color 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-200 text-gray-900 hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
               <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Quantity</h3>
               <div className="flex items-center w-32 border border-gray-200 rounded-xl bg-gray-50 p-1">
                 <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl text-gray-600 hover:bg-white rounded-lg transition-colors"
                 >-</button>
                 <span className="flex-1 text-center font-semibold">{quantity}</span>
                 <button 
                  onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-xl text-gray-600 hover:bg-white rounded-lg transition-colors"
                 >+</button>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className={`w-full py-4 px-8 rounded-full text-lg font-bold text-white transition-all transform active:scale-[0.98] ${
                  product.stockQuantity > 0 
                    ? 'bg-black hover:bg-gray-900 shadow-xl shadow-black/20' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-100">
               <div className="flex flex-col items-center text-center">
                 <ShieldCheck className="w-8 h-8 text-black mb-2" />
                 <span className="text-sm font-medium text-gray-900">Premium Quality</span>
                 <span className="text-xs text-gray-500">Built to last</span>
               </div>
               <div className="flex flex-col items-center text-center">
                 <Truck className="w-8 h-8 text-black mb-2" />
                 <span className="text-sm font-medium text-gray-900">Fast Shipping</span>
                 <span className="text-xs text-gray-500">Nationwide delivery</span>
               </div>
               <div className="flex flex-col items-center text-center">
                 <RefreshCw className="w-8 h-8 text-black mb-2" />
                 <span className="text-sm font-medium text-gray-900">Easy Returns</span>
                 <span className="text-xs text-gray-500">7-day return policy</span>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
