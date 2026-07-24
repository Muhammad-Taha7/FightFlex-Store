import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Trash2, Shield, User, Loader2, Search, Mail, MapPin, Phone, Calendar } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const { token, user: currentUser } = useSelector(state => state.auth);
    const API_URL = 'http://localhost:5000/api/auth';

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.users);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to permanently delete user ${name}?`)) return;
        
        try {
            await axios.delete(`${API_URL}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u => 
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
                <p className="font-semibold text-lg text-slate-200">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-950/40 text-red-400 p-6 rounded-2xl border border-red-900/50 shadow-lg">
                <h3 className="font-bold text-lg mb-2 text-red-300">Error Loading Users</h3>
                <p>{error}</p>
                <button 
                    onClick={fetchUsers} 
                    className="mt-4 px-4 py-2 bg-red-900/40 text-red-200 rounded-xl font-bold hover:bg-red-800/60 transition border border-red-700/50"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-slate-100">
            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                    <h2 className="text-xl font-black text-white tracking-wide">User Management</h2>
                    <p className="text-sm text-slate-400 font-medium mt-1">
                        Managing {users.length} total members
                    </p>
                </div>
                <div className="relative w-full sm:w-auto">
                    <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-[300px] pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-sm font-medium text-slate-100 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/60 border-b border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center">
                                            <Search className="w-12 h-12 text-slate-600 mb-3" />
                                            <p className="text-lg font-bold text-slate-200">No users found</p>
                                            <p className="text-sm text-slate-400">We couldn't find any members matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => {
                                    const avatar = u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=1e293b&color=38bdf8&bold=true`;
                                    const isSelf = currentUser && currentUser.id === u._id;
                                    
                                    return (
                                        <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={avatar} alt={u.username} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-100 flex items-center">
                                                            {u.username} 
                                                            {isSelf && (
                                                                <span className="ml-2 text-[0.65rem] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                    You
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs font-medium text-slate-400 mt-0.5 flex items-center gap-1">
                                                            <Mail className="w-3 h-3 text-slate-500" /> {u.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1.5">
                                                    {u.phone ? (
                                                        <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                                                            <Phone className="w-3.5 h-3.5 text-slate-500" /> {u.phone}
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-slate-500 flex items-center gap-1.5 italic">
                                                            <Phone className="w-3.5 h-3.5 text-slate-600" /> Not provided
                                                        </p>
                                                    )}
                                                    {u.address ? (
                                                        <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium truncate max-w-[200px]" title={u.address}>
                                                            <MapPin className="w-3.5 h-3.5 text-slate-500" /> {u.address}
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-slate-500 flex items-center gap-1.5 italic">
                                                            <MapPin className="w-3.5 h-3.5 text-slate-600" /> Not provided
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                                    u.role === 'admin' 
                                                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                                                        : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                                                }`}>
                                                    {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
                                                    <Calendar className="w-4 h-4 text-slate-500" />
                                                    {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDelete(u._id, u.username)}
                                                    disabled={isSelf}
                                                    className={`p-2 rounded-xl border flex items-center justify-center transition-all ml-auto ${
                                                        isSelf 
                                                        ? 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed' 
                                                        : 'bg-slate-800/80 border-red-900/40 text-red-400 hover:bg-red-950/50 hover:text-red-300 hover:border-red-700/50 cursor-pointer shadow-sm'
                                                    }`}
                                                    title={isSelf ? "You cannot delete your own account" : "Delete User"}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;