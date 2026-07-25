import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  KeyRound,
  LogOut,
  Globe,
  Image,
  Package,
  Users,
  Settings,
  ShoppingCart,
} from "lucide-react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  user,
  handleLogout,
}) => {
  const navItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "home",
      label: "Home / Carousel",
      icon: Image,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
    },
    {
      id: "members",
      label: "Members",
      icon: Users,
    },
    {
      id: "change-password",
      label: "Password",
      icon: KeyRound,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-black border-r border-white/10
          p-5 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          {/* Logo */}
          <div className="hidden md:flex flex-col items-center mb-8 pt-2">
            <img
              src="https://i.postimg.cc/5yxd84ZJ/Fight-Flex2-removebg-preview.png"
              alt="FightFlex"
              className="w-20 object-contain mb-2 filter brightness-0 invert"
            />
            <h1 className="text-xl font-black text-white tracking-wider font-mono">
              FIGHTFLEX
            </h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold mt-1">
              Admin Panel
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-px bg-white/10 mb-5" />

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-sm font-semibold
                  ${
                    isActive
                      ? "bg-white text-black shadow-lg shadow-white/10"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-4.5 h-4.5 flex-shrink-0 ${
                      isActive ? "text-black" : "text-white/50"
                    }`}
                    size={18}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 space-y-1.5">
          {/* User badge */}
          <div className="px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-0.5">Logged in as</p>
            <p className="text-sm text-white font-bold truncate">{user?.username || 'Admin'}</p>
          </div>

          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            <Globe className="w-4 h-4 text-white/50" />
            <span>Visit Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-sm font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;