import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { 
    TrendingUp, 
    ShoppingBag, 
    Loader2, 
    CheckCircle2, 
    Clock, 
    DollarSign, 
    BarChart3, 
    AlertCircle,
    ArrowUpRight
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area, LineChart, Line 
} from 'recharts';

// Theme Constants
const STATUS_CONFIG = {
    pending: { color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
    dispatched: { color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
    cleared: { color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
    cancelled: { color: '#ef4444', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-800' }
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-800 text-xs">
                <p className="font-semibold text-slate-300 mb-1.5">{label}</p>
                {payload.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2 my-0.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-400 capitalize">{entry.name}:</span>
                        <span className="font-bold text-white">
                            {entry.name.toLowerCase().includes('revenue') 
                                ? `Rs ${Number(entry.value).toLocaleString()}` 
                                : entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const DashboardOverview = () => {
    const { token } = useSelector((state) => state.auth);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchAnalytics = async () => {
            try {
                setError(null);
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/analytics`, config);
                if (isMounted) setAnalytics(res.data);
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching analytics", err);
                    setError("Failed to load dashboard data. Please try again later.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (token) fetchAnalytics();
        return () => { isMounted = false; };
    }, [token]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">Gathering real-time analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-lg mx-auto my-12">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                <h3 className="text-rose-900 font-bold text-lg mb-1">Analytics Unavailable</h3>
                <p className="text-rose-600 text-sm">{error}</p>
            </div>
        );
    }

    const pieData = [
        { name: 'Pending', value: analytics?.pendingOrders || 0, statusKey: 'pending' },
        { name: 'Dispatched', value: analytics?.dispatchedOrders || 0, statusKey: 'dispatched' },
        { name: 'Cleared', value: analytics?.clearedOrders || 0, statusKey: 'cleared' },
        { name: 'Cancelled', value: analytics?.cancelledOrders || 0, statusKey: 'cancelled' }
    ].filter(d => d.value > 0);

    const monthlyData = analytics?.monthlyRevenue || [];
    const dailyData = analytics?.dailyOrders || [];

    const statCards = [
        {
            title: 'Total Revenue',
            value: `Rs ${(analytics?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            style: STATUS_CONFIG.cleared
        },
        {
            title: 'Total Orders',
            value: (analytics?.totalOrders || 0).toLocaleString(),
            icon: ShoppingBag,
            style: STATUS_CONFIG.dispatched
        },
        {
            title: 'Cleared Orders',
            value: (analytics?.clearedOrders || 0).toLocaleString(),
            icon: CheckCircle2,
            style: STATUS_CONFIG.cleared
        },
        {
            title: 'Pending Orders',
            value: (analytics?.pendingOrders || 0).toLocaleString(),
            icon: Clock,
            style: STATUS_CONFIG.pending
        }
    ];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div 
                            key={idx} 
                            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${card.style.bg}`}>
                                    <Icon className={`w-5 h-5 ${card.style.text}`} />
                                </div>
                                <span className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                                    <ArrowUpRight className="w-4 h-4" />
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-500 font-medium text-xs mb-1 uppercase tracking-wider">{card.title}</p>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Monthly Revenue</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Historical revenue breakdown</p>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" fill="url(#revenueGradient)" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Daily Orders Bar Chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Daily Orders</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Order volume for the last 7 days</p>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <BarChart3 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="orders" name="Orders" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Pie Chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Order Distribution</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Breakdown by current order status</p>
                        </div>
                    </div>
                    <div className="h-[220px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry) => (
                                        <Cell key={entry.name} fill={STATUS_CONFIG[entry.statusKey]?.color || '#94a3b8'} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Total Count */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-slate-900">{analytics?.totalOrders || 0}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total</span>
                        </div>
                    </div>
                    {/* Dynamic Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-2 pt-4 border-t border-slate-50">
                        {pieData.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_CONFIG[entry.statusKey]?.color }} />
                                <span className="text-xs text-slate-500 font-medium">{entry.name}:</span>
                                <span className="text-xs font-bold text-slate-900">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Volume Line Chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Monthly Order Trends</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Volume trajectory month over month</p>
                        </div>
                    </div>
                    <div className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="orders" name="Orders" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            {analytics?.recentOrders && analytics.recentOrders.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Latest transactions processed</p>
                        </div>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                            Latest {analytics.recentOrders.length}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                                    <th className="pb-3 pl-1">Order Ref</th>
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3 text-right pr-1">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {analytics.recentOrders.map((order) => {
                                    const statusStyle = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                    return (
                                        <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3.5 pl-1 font-mono font-medium text-slate-900">
                                                #{order._id ? order._id.slice(-6).toUpperCase() : 'N/A'}
                                            </td>
                                            <td className="py-3.5 text-slate-500">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
                                            </td>
                                            <td className="py-3.5 font-bold text-slate-900">
                                                Rs {(order.totalPrice || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3.5 text-right pr-1">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[10px] capitalize ${statusStyle.badge}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardOverview;