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
import { Menu, X, Dumbbell, Bell, Users, Settings } from 'lucide-react';

export const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
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
                const res = await axios.get('http://localhost:5000/api/orders/analytics', config);
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
                        <div className="relative cursor-pointer">
                            <button 
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900 transition hover:bg-gray-50"
                            >
                                <Bell className="w-5 h-5" />
                            </button>
                            {hasNewOrder && (
                                <>
                                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
                                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                </>
                            )}

                            {/* Notifications Dropdown */}
                            {notificationsOpen && (
                                <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                        <h3 className="font-bold text-gray-900">Notifications</h3>
                                        {notifications.length > 0 && (
                                            <span className="text-xs font-semibold bg-gray-100 text-black px-2 py-1 rounded-lg">
                                                {notifications.length} New
                                            </span>
                                        )}
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center text-gray-500 text-sm">
                                                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                No new notifications
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div 
                                                    key={notif.id} 
                                                    onClick={() => {
                                                        setActiveTab('orders');
                                                        setNotificationsOpen(false);
                                                    }}
                                                    className="p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                                >
                                                    <p className="text-sm text-gray-800 font-medium group-hover:text-black transition-colors">{notif.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-3 bg-gray-50/50 border-t border-gray-100 text-center">
                                        <button 
                                            onClick={() => setNotificationsOpen(false)}
                                            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            System Live
                        </span>
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