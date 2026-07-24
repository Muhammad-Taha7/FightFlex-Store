import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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

// Demo products fallback if needed
const DEMO_PRODUCTS = [
  { id: 1, name: 'Pro Boxing Gloves', category: 'Gloves', price: 4500 },
  { id: 2, name: 'MMA Fight Shorts', category: 'Men', price: 2800 },
  { id: 3, name: 'Whey Protein Isolate', category: 'Nutrition', price: 8500 },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
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

  // Scroll event listener (handles window and body scroll)
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

  // Filter products for search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    setSearchResults(
      DEMO_PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

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
      {/* MAIN NAVBAR - Dynamic Backdrop Blur on Scroll */}
      <nav 
        style={{
          backdropFilter: shouldBlur ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: shouldBlur ? 'blur(12px)' : 'none'
        }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          shouldBlur 
            ? 'bg-slate-950/80 border-b border-white/10 shadow-lg py-0' 
            : 'bg-transparent border-b border-transparent py-2'
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand Logo */}
            <Link to="/" className="text-2xl font-black tracking-wider uppercase flex-shrink-0 no-underline drop-shadow-md">
              <span className="text-blue-500">Fight</span>
              <span className="text-white">Flex</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`transition-colors duration-200 font-semibold text-[0.925rem] tracking-tight no-underline relative py-1 drop-shadow ${
                      isActive ? 'text-blue-400' : 'text-white hover:text-blue-400'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-5">
              {/* Search Toggle Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white hover:text-blue-400 transition-colors duration-200 p-2 cursor-pointer bg-transparent border-none rounded-full hover:bg-white/10 drop-shadow"
                aria-label="Open Search"
              >
                <Search size={20} />
              </button>

              {/* User Dropdown / Login Button */}
              {isAuthenticated && user ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-white p-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors duration-200 border border-white/30 bg-transparent drop-shadow"
                    aria-expanded={dropdownOpen}
                  >
                    <img
                      src={userAvatar}
                      alt={user.username}
                      className="w-7 h-7 rounded-full object-cover border border-white/50"
                    />
                    <span className="text-sm font-semibold max-w-[100px] truncate">{user.username}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl p-2 min-w-[190px] shadow-2xl transition-all duration-200 z-10 ${
                      dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-200 text-sm font-medium rounded-xl hover:bg-white/10 hover:text-white transition-colors duration-150 no-underline"
                    >
                      <UserCircle size={17} className="text-gray-400" /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-200 text-sm font-medium rounded-xl hover:bg-white/10 hover:text-white transition-colors duration-150 no-underline"
                    >
                      <Package size={17} className="text-gray-400" /> My Orders
                    </Link>
                    <div className="h-px bg-white/10 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-500/10 transition-colors duration-150 cursor-pointer w-full text-left bg-transparent border-none"
                    >
                      <LogOut size={17} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/client-login"
                  className="flex items-center gap-1.5 text-white hover:text-blue-400 transition-colors duration-200 font-semibold no-underline py-1.5 px-3.5 rounded-full hover:bg-white/10 border border-white/30 bg-transparent drop-shadow"
                >
                  <User size={18} />
                  <span className="text-sm">Login</span>
                </Link>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-white hover:text-blue-400 transition-colors duration-200 p-2 cursor-pointer bg-transparent border-none rounded-full hover:bg-white/10 drop-shadow"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-[0.65rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white p-2 cursor-pointer bg-transparent border-none rounded-full hover:bg-white/10 drop-shadow"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="relative text-white p-2 cursor-pointer bg-transparent border-none rounded-full hover:bg-white/10 drop-shadow"
                aria-label="Cart"
              >
                <ShoppingBag size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-white p-2 cursor-pointer bg-transparent border-none rounded-lg hover:bg-white/10 drop-shadow"
                aria-label="Toggle Navigation Menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE NAV DRAWER */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-[90] bg-black/50 transition-all duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      <div
        className={`fixed top-0 left-0 bottom-0 w-full max-w-[300px] bg-slate-950 z-[95] md:hidden flex flex-col border-r border-white/10 shadow-2xl transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10 flex-shrink-0">
          <Link
            to="/"
            className="text-xl font-black tracking-wider uppercase no-underline flex items-center"
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-blue-500">Fight</span>
            <span className="text-white">Flex</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="bg-white/5 border border-white/10 text-gray-400 p-2 rounded-xl cursor-pointer hover:bg-white/10 hover:text-white transition-colors duration-200 flex items-center"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-3 px-4 font-bold transition-colors text-[0.95rem] no-underline rounded-xl ${
                  isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:text-white hover:bg-white/5'
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
              className="flex items-center gap-3 py-3 px-4 text-blue-400 font-bold text-[0.95rem] no-underline rounded-xl hover:bg-blue-500/10 border border-blue-500/20"
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

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 mb-5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
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
            {searchQuery.trim() === '' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search size={48} className="text-gray-600" />
                <p className="text-gray-400 mt-4 text-[0.95rem] font-medium">
                  Type to search across all products
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-white text-lg font-bold">No results found</p>
                <p className="text-gray-400 text-sm mt-1">Try a different keyword</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </p>
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    className="flex items-center justify-between p-4 rounded-xl cursor-pointer bg-white/5 border border-white/10 text-left w-full hover:bg-blue-600/10 hover:border-blue-500/30 transition-all duration-150"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    <div>
                      <p className="text-[0.95rem] font-bold text-white m-0">{product.name}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{product.category}</p>
                    </div>
                    <p className="text-sm font-extrabold text-blue-400 m-0 flex-shrink-0">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CART DRAWER */}
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[90] bg-black/50 transition-all duration-300 ${
          cartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-slate-950 z-[95] flex flex-col border-l border-white/10 shadow-2xl transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10 flex-shrink-0">
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-white m-0">
            <ShoppingBag size={20} className="text-blue-500" /> Shopping Cart
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="bg-transparent border-none text-gray-400 p-2 rounded-xl cursor-pointer hover:bg-white/10 hover:text-white transition-colors duration-200 flex items-center"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center">
          <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
            <ShoppingBag size={44} className="text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-[260px]">
            Looks like you haven't added anything yet. Start exploring our collection!
          </p>
          <button
            onClick={() => {
              setCartOpen(false);
              navigate('/');
            }}
            className="bg-blue-600 text-white border-none px-8 py-3.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-600/30"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </>
  );
};