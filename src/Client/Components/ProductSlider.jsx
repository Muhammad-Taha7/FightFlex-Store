import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Star, ArrowRight } from 'lucide-react';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const dragStart = useRef(null);
  const dragging  = useRef(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        const all = res.data.products || res.data || [];
        setProducts(all.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = products.length;
  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);

  // ── Drag / swipe handlers ──
  const onPointerDown = (x) => {
    dragStart.current = x;
    dragging.current  = false;
  };
  const onPointerMove = (x) => {
    if (dragStart.current === null) return;
    if (Math.abs(x - dragStart.current) > 8) dragging.current = true;
  };
  const onPointerUp = (x) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - x;
    if (Math.abs(diff) > 45) diff > 0 ? next() : prev();
    dragStart.current = null;
    dragging.current  = false;
  };


  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-64 h-80 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">
              Featured Collection
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              Top Picks For You
            </h2>
          </div>
          <Link
            to="/men"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-900 hover:gap-3 transition-all duration-200 group"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Track */}
          <div
            className="flex gap-5 transition-transform duration-500 ease-out will-change-transform select-none"
            style={{
              transform: `translateX(calc(-${current * (100 / Math.min(total, 3))}% - ${current * 20 / Math.min(total, 3)}px))`,
              cursor: 'grab',
            }}
            onMouseDown={e => onPointerDown(e.clientX)}
            onMouseMove={e => onPointerMove(e.clientX)}
            onMouseUp={e => onPointerUp(e.clientX)}
            onMouseLeave={e => { if (dragStart.current !== null) onPointerUp(e.clientX); }}
            onTouchStart={e => onPointerDown(e.touches[0].clientX)}
            onTouchMove={e => onPointerMove(e.touches[0].clientX)}
            onTouchEnd={e => onPointerUp(e.changedTouches[0].clientX)}
          >

            {products.map((product, idx) => {
              const image = product.images?.[0]?.imageUrl || product.images?.[0] || '';
              const isActive = idx === current;
              return (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="flex-shrink-0 w-[calc(33.333%-14px)] sm:w-[calc(33.333%-14px)] max-w-xs group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-400"
                  style={{ minWidth: 'min(280px, 80vw)' }}
                  draggable={false}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
                    {image ? (
                      <img
                        src={image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-gray-200" />
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase">
                        {product.category}
                      </span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 ring-2 ring-black ring-inset rounded-3xl pointer-events-none" />
                    )}

                    {/* Hover CTA */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-white font-bold text-sm flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Shop Now
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-base leading-snug truncate">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gray-900 text-gray-900" />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">(4.9)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-gray-900">
                        PKR {Number(product.price).toLocaleString()}
                      </span>
                      {product.stockQuantity > 0 ? (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Prev / Next Buttons */}
          <button
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-7 h-2 bg-gray-900'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden flex justify-center mt-6">
          <Link
            to="/men"
            className="flex items-center gap-2 text-sm font-bold text-gray-900 border border-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
