import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logoutUser } from '../../store/authSlice';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  Package, 
  LogOut, 
  UserCircle 
} from 'lucide-react';
import CartDrawer from './CartDrawer';

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Track scroll state
  const [isScrolled, setIsScrolled] = useState(false);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Check if current route is Home page
  const isHomePage = location.pathname === '/';

  // Redux state
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const cartItems = useSelector((state) => state.cart?.items || []);
  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background body scroll when overlays are open
  useEffect(() => {
    const isOverlayActive = searchOpen || cartOpen || mobileOpen;
    document.body.style.overflow = isOverlayActive ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen, cartOpen, mobileOpen]);

  // Focus search input on modal open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Click outside user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESC Key close modals
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setCartOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  // Fetch products dynamically for search
  useEffect(() => {
    const fetchSearch = async () => {
      setIsSearching(true);
      try {
        if (!searchQuery.trim()) {
          // Fetch newest products as suggestions if search query is empty
          const res = await axios.get(`http://localhost:5000/api/products`);
          setSearchResults(res.data.products?.slice(0, 5) || []);
        } else {
          // Fetch actual search results
          const res = await axios.get(`http://localhost:5000/api/products?search=${searchQuery}`);
          setSearchResults(res.data.products || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    // Only fetch if search overlay is open
    if (searchOpen) {
      const debounce = setTimeout(() => {
        fetchSearch();
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [searchQuery, searchOpen]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/men', label: 'Men' },
    { to: '/women', label: 'Women' },
    { to: '/kids', label: 'Kids' },
    { to: '/accessories', label: 'Accessories' },
    { to: '/nutrition', label: 'Nutrition' },
  ];

  const userAvatar = user?.profileImage || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=2563eb&color=ffffff&size=80&bold=true`;

  const shouldBlur = !isHomePage || isScrolled;

  return (
    <>
      <nav 
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white border-gray-200 shadow-sm py-0' 
            : 'bg-white/90 border-transparent py-2'
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex flex-col items-center justify-center leading-none">
              <img src="https://i.postimg.cc/5yxd84ZJ/Fight-Flex2-removebg-preview.png" alt="FightFlex Logo" className="h-8 md:h-9 object-contain mb-0.5" style={{ filter: 'brightness(0)' }} />
              <span className="font-black text-[0.65rem] md:text-[0.7rem] tracking-[0.15em] text-gray-900 font-mono uppercase">FIGHTFLEX</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`font-semibold text-sm transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Search size={20} />
              </button>

              {isAuthenticated && user ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold"
                  >
                    <img
                      src={userAvatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                    <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-2xl p-2 min-w-[190px] shadow-lg transition-all duration-200 z-10 ${dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
                      <User size={16} /> Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
                      <Package size={16} /> My Orders
                    </Link>
                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/client-login" className="text-sm font-bold text-gray-900 hover:text-gray-900">Login</Link>
              )}

              <button onClick={() => setCartOpen(true)} className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* FIXED: Yahan Mobile Menu, Search aur Cart buttons add kiye gaye hain */}
            <div className="md:hidden flex items-center gap-1">
              {/* Mobile Search Button */}
              <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Search size={22} />
              </button>

              {/* Mobile Cart Button */}
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingBag size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu (Hamburger) Button */}
              <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-900 ml-1">
                <Menu size={24} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 z-[100] bg-slate-950/95 flex flex-col transition-all duration-300 overflow-y-auto md:hidden ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center">
            <img src="https://i.postimg.cc/5yxd84ZJ/Fight-Flex2-removebg-preview.png" alt="FightFlex" className="h-8 object-contain" style={{ filter: 'brightness(0)' }} />
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-300 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 px-4 py-6 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`block px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive ? 'bg-gray-900/20 text-gray-400 border border-gray-800/30' : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="h-px bg-white/10 my-4" />

          {isAuthenticated && user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 py-2.5 px-3 mb-2 bg-white/5 rounded-xl border border-white/10">
                <img
                  src={userAvatar}
                  alt={user.username}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div className="min-w-0">
                  <span className="text-white font-extrabold text-sm block truncate">{user.username}</span>
                  <span className="text-gray-400 text-xs font-semibold block truncate">{user.email}</span>
                </div>
              </div>

              <Link
                to="/profile"
                className="flex items-center gap-3 py-3 px-4 text-gray-300 font-bold hover:text-white transition-colors text-[0.95rem] no-underline rounded-xl hover:bg-white/5"
                onClick={() => setMobileOpen(false)}
              >
                <UserCircle size={18} className="text-gray-400" /> Profile
              </Link>

              <Link
                to="/orders"
                className="flex items-center gap-3 py-3 px-4 text-gray-300 font-bold hover:text-white transition-colors text-[0.95rem] no-underline rounded-xl hover:bg-white/5"
                onClick={() => setMobileOpen(false)}
              >
                <Package size={18} className="text-gray-400" /> Orders
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-3 px-4 text-red-400 font-bold transition-colors text-[0.95rem] cursor-pointer bg-transparent border-none text-left rounded-xl hover:bg-red-500/10 w-full"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/client-login"
              className="flex items-center gap-3 py-3 px-4 text-gray-400 font-bold text-[0.95rem] no-underline rounded-xl hover:bg-gray-800/10 border border-gray-800/20"
              onClick={() => setMobileOpen(false)}
            >
              <User size={18} /> Login / Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* SEARCH OVERLAY */}
      <div
        className={`fixed inset-0 z-[100] bg-slate-950/95 flex flex-col items-center transition-all duration-300 overflow-y-auto ${
          searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className={`w-full max-w-xl px-5 pt-12 pb-6 transition-transform duration-300 ${
            searchOpen ? 'translate-y-0' : '-translate-y-10'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white m-0">Search Products</h2>
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="bg-white/10 border border-white/10 text-gray-300 p-2 rounded-xl cursor-pointer hover:bg-white/20 hover:text-white transition-colors duration-200 flex items-center"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 mb-5 focus-within:border-gray-800 focus-within:ring-2 focus-within:ring-gray-800/20 transition-all">
            <Search size={20} className="text-gray-400 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for gloves, shorts, nutrition..."
              className="flex-1 bg-transparent border-none outline-none text-white text-base placeholder-gray-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-gray-400 hover:text-white cursor-pointer p-1 bg-transparent border-none flex items-center"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="min-h-[200px]">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-gray-400 font-medium">Searching...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-white text-lg font-bold">No results found</p>
                <p className="text-gray-400 text-sm mt-1">Try a different keyword</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
                  {searchQuery.trim() === '' ? 'New Arrivals Suggestions' : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} found`}
                </p>
                {searchResults.map((product) => {
                  const imageUrl = product.images?.[0]?.imageUrl || product.images?.[0] || null;
                  return (
                    <button
                      key={product._id}
                      className="flex items-center gap-4 p-3 rounded-xl cursor-pointer bg-white/5 border border-white/10 text-left w-full hover:bg-white/10 hover:border-white/20 transition-all duration-150 group"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                        navigate(`/product/${product._id}`);
                      }}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate m-0">{product.title}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">{product.category}</p>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-extrabold text-white/80 m-0 flex-shrink-0">
                        PKR {Number(product.price).toLocaleString()}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CART DRAWER */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};