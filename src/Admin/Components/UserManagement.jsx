import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Trash2, Shield, User, Loader2, Search, Mail, MapPin, Phone, Calendar, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';

// Reusable Dialog Component
const DialogBox = ({ open, onClose, type = 'info', title, message, onConfirm, confirmText, cancelText }) => {
  if (!open) return null;

  const icons = {
    success: <CheckCircle className="w-16 h-16 text-emerald-500" />,
    error: <XCircle className="w-16 h-16 text-red-500" />,
    confirm: <AlertCircle className="w-16 h-16 text-amber-500" />,
    info: <Package className="w-16 h-16 text-gray-800" />,
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl animate-[scaleIn_0.2s_ease-out]">
        <div className="flex justify-center mb-5">
          {icons[type]}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                {cancelText || 'Cancel'}
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-colors ${
                  type === 'confirm' 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-900 text-white hover:bg-black'
                }`}
              >
                {confirmText || 'Confirm'}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Dialog state
    const [dialog, setDialog] = useState({ open: false, type: 'info', title: '', message: '', onConfirm: null, confirmText: '', cancelText: '' });
    const showDialog = (type, title, message, onConfirm = null, confirmText = '', cancelText = '') => {
      setDialog({ open: true, type, title, message, onConfirm, confirmText, cancelText });
    };
    const closeDialog = () => setDialog({ ...dialog, open: false });

    const { token, user: currentUser } = useSelector(state => state.auth);
    const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

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
        try {
            await axios.delete(`${API_URL}/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== id));
            showDialog('success', 'User Deleted', `${name} has been removed from the system successfully.`);
        } catch (err) {
            showDialog('error', 'Deletion Failed', err.response?.data?.message || 'Failed to delete user.');
        }
    };

    const confirmDelete = (id, name) => {
        showDialog(
            'confirm',
            'Delete User?',
            `Are you sure you want to permanently delete ${name}? This action cannot be undone.`,
            () => handleDelete(id, name),
            'Delete',
            'Cancel'
        );
    };

    const filteredUsers = users.filter(u => 
        (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-gray-800" />
                <p className="font-semibold text-lg text-gray-500">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 shadow-sm max-w-xl mx-auto mt-10 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Error Loading Users</h3>
                <p className="text-sm mb-4">{error}</p>
                <button 
                    onClick={fetchUsers} 
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-gray-900">
            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-wide">User Management</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Managing {users.length} total members
                    </p>
                </div>
                <div className="relative w-full sm:w-auto">
                    <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-[300px] pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800/20 transition-all"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <Search className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-lg font-bold text-gray-900">No users found</p>
                                            <p className="text-sm text-gray-500">We couldn't find any members matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => {
                                    const displayName = u.username || u.name || 'Unknown';
                                    const avatar = u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=ffffff&bold=true`;
                                    const isSelf = currentUser && currentUser.id === u._id;
                                    
                                    return (
                                        <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={avatar} alt={displayName} className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 flex items-center">
                                                            {displayName} 
                                                            {isSelf && (
                                                                <span className="ml-2 text-[0.65rem] bg-gray-100 text-black border border-gray-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                    You
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs font-medium text-gray-500 mt-0.5 flex items-center gap-1">
                                                            <Mail className="w-3 h-3 text-gray-400" /> {u.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1.5">
                                                    {u.phone ? (
                                                        <p className="text-xs text-gray-700 flex items-center gap-1.5 font-medium">
                                                            <Phone className="w-3.5 h-3.5 text-gray-400" /> {u.phone}
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-gray-400 flex items-center gap-1.5 italic">
                                                            <Phone className="w-3.5 h-3.5 text-gray-300" /> Not provided
                                                        </p>
                                                    )}
                                                    {u.address ? (
                                                        <p className="text-xs text-gray-700 flex items-center gap-1.5 font-medium truncate max-w-[200px]" title={u.address}>
                                                            <MapPin className="w-3.5 h-3.5 text-gray-400" /> {u.address}
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-gray-400 flex items-center gap-1.5 italic">
                                                            <MapPin className="w-3.5 h-3.5 text-gray-300" /> Not provided
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                                    u.role === 'admin' 
                                                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                    {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => confirmDelete(u._id, displayName)}
                                                    disabled={isSelf}
                                                    className={`p-2 rounded-xl border flex items-center justify-center transition-all ml-auto ${
                                                        isSelf 
                                                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-white border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer shadow-sm'
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
            
            <DialogBox 
                open={dialog.open}
                onClose={closeDialog}
                type={dialog.type}
                title={dialog.title}
                message={dialog.message}
                onConfirm={dialog.onConfirm}
                confirmText={dialog.confirmText}
                cancelText={dialog.cancelText}
            />
        </div>
    );
};

export default UserManagement;