import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logoutAdmin } from '../store/authSlice';
import Sidebar from './Components/Sidebar';
import DashboardOverview from './Components/DashboardOverview';
import ChangePassword from './Components/ChangePassword';
import UserManagement from './Components/UserManagement';
import CarouselManagement from './Components/CarouselManagement';
import ProductManagement from './Components/ProductManagement';
import OrderManagement from './Components/OrderManagement';
import DashboardLoader from './Components/DashboardLoader';
import { Menu, X, Dumbbell, Bell, Users, Settings } from 'lucide-react';

export const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dashLoading, setDashLoading] = useState(true);

    // Show branded loader on first mount
    useEffect(() => {
        const t = setTimeout(() => setDashLoading(false), 1800);
        return () => clearTimeout(t);
    }, []);
    
    // Notification logic
    const [hasNewOrder, setHasNewOrder] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const checkNewOrders = async () => {
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/analytics`, config);
                if (res.data.pendingOrders > 0) {
                    setHasNewOrder(true);
                    // Just to give them a nice list if there are pending orders
                    setNotifications([{
                        id: 1,
                        message: `You have ${res.data.pendingOrders} pending orders requiring attention.`,
                        time: 'Just now',
                        type: 'order'
                    }]);
                } else {
                    setHasNewOrder(false);
                    setNotifications([]);
                }
            } catch (error) {
                console.error("Notification check error", error);
            }
        };

        checkNewOrders();
        const interval = setInterval(checkNewOrders, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [token]);

    const handleLogout = async () => {
        await dispatch(logoutAdmin());
        navigate('/login');
    };

    if (dashLoading) return <DashboardLoader message="Loading dashboard..." />;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row font-sans">
            {/* Mobile Header Toggle */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-white -rotate-45" />
                    </div>
                    <span className="font-black text-lg tracking-wider text-gray-900 font-mono">FIGHTFLEX</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-black"
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
            <main className="flex-1 min-w-0 bg-gray-50 p-4 sm:p-8 overflow-y-auto">
                {/* Top Header Bar */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200 relative">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 capitalize">
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'home' && 'Home Carousel Management'}
                            {activeTab === 'products' && 'Products Management'}
                            {activeTab === 'orders' && 'Order Management'}
                            {activeTab === 'change-password' && 'Change Password & Credentials'}
                            {activeTab === 'members' && 'Gym Members Directory'}
                            {activeTab === 'settings' && 'System Configuration'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Welcome back, <span className="text-gray-900 font-semibold">{user?.username || 'Admin'}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                    <div className="relative" id="notifications-wrapper">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="relative p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                        >
                            <Bell className="w-5 h-5" />
                            {hasNewOrder && (
                                <>
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-ping" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                                </>
                            )}
                        </button>

                        {/* ── Professional Notification Panel ── */}
                        {notificationsOpen && (
                            <div className="absolute top-full right-0 mt-3 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">

                                {/* Panel Header */}
                                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                                    <div>
                                        <h3 className="font-black text-gray-900 text-sm tracking-tight">Notifications</h3>
                                        {notifications.length > 0 && (
                                            <p className="text-xs text-gray-400 mt-0.5">{notifications.length} new alert{notifications.length > 1 ? 's' : ''}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {notifications.length > 0 && (
                                            <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-full border border-red-100 tracking-wide uppercase">
                                                {notifications.length} New
                                            </span>
                                        )}
                                        <button
                                            onClick={() => setNotificationsOpen(false)}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Notification List */}
                                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                                    {notifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-center px-5">
                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                                                <Bell className="w-5 h-5 text-gray-300" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-700">All caught up!</p>
                                            <p className="text-xs text-gray-400 mt-1">No new notifications right now.</p>
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                onClick={() => { setActiveTab('orders'); setNotificationsOpen(false); }}
                                                className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                                            >
                                                {/* Icon */}
                                                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                                    <Bell className="w-4 h-4 text-amber-600" />
                                                </div>
                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-gray-900 transition-colors">
                                                        {notif.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                                            Pending Orders
                                                        </span>
                                                        <span className="text-xs text-gray-400">{notif.time}</span>
                                                    </div>
                                                </div>
                                                {/* Unread dot */}
                                                <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1.5" />
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Panel Footer */}
                                <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
                                    <button
                                        onClick={() => { setActiveTab('orders'); setNotificationsOpen(false); }}
                                        className="text-xs font-bold text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1.5 group"
                                    >
                                        View All Orders
                                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                    </button>
                                    <button
                                        onClick={() => setNotificationsOpen(false)}
                                        className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    
                    </div>
                </header>

                {/* Tab Views */}
                {activeTab === 'overview' && <DashboardOverview user={user} />}

                {activeTab === 'home' && <CarouselManagement />}

                {activeTab === 'products' && <ProductManagement />}
                
                {activeTab === 'orders' && <OrderManagement />}

                {activeTab === 'members' && <UserManagement />}

                {activeTab === 'change-password' && <ChangePassword />}
                {activeTab === 'settings' && (
                    <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
                        <Settings className="w-12 h-12 text-gray-400 mx-auto" />
                        <h3 className="text-xl font-bold text-gray-900">System Settings</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            Configure portal preferences, API keys, and notification triggers.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;