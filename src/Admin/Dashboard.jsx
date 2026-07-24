import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../store/authSlice';
import Sidebar from './Components/Sidebar';
import DashboardOverview from './Components/DashboardOverview';
import ChangePassword from './Components/ChangePassword';
import UserManagement from './Components/UserManagement';
import CarouselManagement from './Components/CarouselManagement';
import ProductManagement from './Components/ProductManagement';
import { Menu, X, Dumbbell, Bell, Users, Settings } from 'lucide-react';

export const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await dispatch(logoutAdmin());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
            {/* Mobile Header Toggle */}
            <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-white -rotate-45" />
                    </div>
                    <span className="font-black text-lg tracking-wider text-white font-mono">FIGHTFLEX</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            <Sidebar 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                user={user} 
                handleLogout={handleLogout} 
            />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 bg-slate-950 p-4 sm:p-8 overflow-y-auto">
                {/* Top Header Bar */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white capitalize">
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'home' && 'Home Carousel Management'}
                            {activeTab === 'products' && 'Products Management'}
                            {activeTab === 'change-password' && 'Change Password & Credentials'}
                            {activeTab === 'members' && 'Gym Members Directory'}
                            {activeTab === 'settings' && 'System Configuration'}
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Welcome back, <span className="text-blue-400 font-semibold">{user?.username || 'Admin'}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition hover:bg-slate-850">
                                <Bell className="w-5 h-5" />
                            </button>
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-950"></span>
                        </div>
                        <div className="h-8 w-px bg-slate-800"></div>
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            System Live
                        </span>
                    </div>
                </header>

                {/* Tab Views */}
                {activeTab === 'overview' && <DashboardOverview user={user} />}

                {activeTab === 'home' && <CarouselManagement />}

                {activeTab === 'products' && <ProductManagement />}

                {activeTab === 'members' && <UserManagement />}

                {activeTab === 'change-password' && <ChangePassword />}
                {activeTab === 'settings' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
                        <Settings className="w-12 h-12 text-slate-500 mx-auto" />
                        <h3 className="text-xl font-bold text-white">System Settings</h3>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">
                            Configure portal preferences, API keys, and notification triggers.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;