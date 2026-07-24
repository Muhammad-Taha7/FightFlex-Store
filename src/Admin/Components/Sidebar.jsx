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
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-slate-900 border-r border-slate-800
        p-5 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
      `}
    >
      <div>
        {/* Logo */}
        <div className="hidden md:flex flex-col items-center mb-8">
          <img
            src="https://i.postimg.cc/5yxd84ZJ/Fight-Flex2-removebg-preview.png"
            alt="FightFlex"
            className="w-24 object-contain mb-2"
          />

          <h1 className="text-2xl font-black text-white tracking-wider font-mono">
            FIGHTFLEX
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold mt-1">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer text-sm font-semibold
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-slate-800 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
        >
          <Globe className="w-5 h-5 text-slate-400" />
          <span>Visit Website</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold transition cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;