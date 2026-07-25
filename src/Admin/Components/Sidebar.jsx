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
      id: "orders",
      label: "Orders",
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
        w-64 bg-white border-r border-gray-200
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
            className="w-24 object-contain mb-2 filter brightness-0"
          />

          <h1 className="text-2xl font-black text-gray-900 tracking-wider font-mono">
            FIGHTFLEX
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold mt-1">
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
                    ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-gray-200 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-black transition"
        >
          <Globe className="w-5 h-5 text-gray-400" />
          <span>Visit Website</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 text-sm font-bold transition cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;