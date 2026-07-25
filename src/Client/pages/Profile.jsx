import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateProfile, clearAuthStatus } from '../../store/authSlice';
import { 
  Mail, MapPin, Calendar, Edit3, Save, X, 
  AlertCircle, Camera, User, Phone, CheckCircle, Package 
} from 'lucide-react';

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

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    address: '',
    phone: '',
  });

  // Dialog State
  const [dialog, setDialog] = useState({ open: false, type: 'info', title: '', message: '', onConfirm: null });
  const showDialog = (type, title, message, onConfirm = null) => {
    setDialog({ open: true, type, title, message, onConfirm });
  };
  const closeDialog = () => setDialog({ ...dialog, open: false });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/client-login');
    }
  }, [isAuthenticated, navigate]);

  // Sync user state with local edit state
  useEffect(() => {
    if (user) {
      setEditData({
        username: user.username || user.name || '',
        address: user.address || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearAuthStatus());
    };
  }, [dispatch]);

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile({
      username: editData.username,
      address: editData.address,
      phone: editData.phone,
    }));

    if (updateProfile.fulfilled.match(result)) {
      setIsEditing(false);
      showDialog('success', 'Profile Updated', 'Your profile details have been successfully saved.');
    } else {
      showDialog('error', 'Update Failed', 'Failed to update profile details.');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setIsUploading(true);
      try {
        const token = localStorage.getItem('fightflex_token');
        const response = await axios.post(
          'http://localhost:5000/api/auth/upload-avatar', 
          { image: base64Data },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          const imageUrl = response.data.url;
          const result = await dispatch(updateProfile({ profileImage: imageUrl }));
          
          if (updateProfile.fulfilled.match(result)) {
            showDialog('success', 'Avatar Updated', 'Your profile picture has been uploaded successfully.');
          }
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        showDialog('error', 'Upload Failed', err.response?.data?.message || 'Failed to upload profile image.');
      } finally {
        setIsUploading(false);
      }
    };
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      username: user?.username || user?.name || '',
      address: user?.address || '',
      phone: user?.phone || '',
    });
    dispatch(clearAuthStatus());
  };

  if (!user) return null;

  const userAvatar = user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name || 'User')}&background=3b82f6&color=ffffff&size=200&bold=true`;
  
  const memberSince = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="min-h-screen pt-[5rem] md:pt-[7rem] w-full bg-slate-50 text-gray-900 py-8 px-4 sm:px-8 lg:px-12">
      <div className="w-full max-w-5xl mx-auto">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Manage your profiles, credentials, and settings.</p>
          </div>
          <span className="self-start md:self-auto px-3.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-900 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></span>
            Profile Verified
          </span>
        </div>

        {/* Full-width Card Wrapper */}
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-3xl overflow-hidden transition-all duration-300">
          
          {/* Avatar & Info Banner */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-8 sm:px-10 flex flex-col sm:flex-row items-center gap-6">
            
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img 
                src={userAvatar} 
                alt={user.username || user.name || 'User'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105" 
              />
              
              {isUploading ? (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200 text-white gap-1 backdrop-blur-sm">
                  <Camera size={20} />
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider">Upload</span>
                </div>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
              disabled={isUploading}
            />

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-black text-gray-900">{user.username || user.name}</h2>
              <p className="text-gray-500 text-sm mt-0.5 font-medium">{user.email}</p>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-2 justify-center sm:justify-start font-semibold">
                <Calendar size={13} />
                <span>Joined on {memberSince}</span>
              </div>
            </div>
          </div>

          {/* Profile Form Details */}
          <form onSubmit={handleSaveInfo} className="p-6 sm:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  <User size={14} /> Profile Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800/20 transition-all font-semibold text-gray-900"
                  />
                ) : (
                  <p className="font-bold text-sm bg-gray-50 rounded-2xl px-5 py-3.5 border border-gray-200 text-gray-900">
                    {user.username || user.name}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  <Mail size={14} /> Email Address
                </label>
                <p className="text-gray-500 font-medium text-sm bg-gray-100 rounded-2xl px-5 py-3.5 border border-gray-200 select-none">
                  {user.email}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  <Phone size={14} /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    placeholder="+92 XXXXXXXX"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800/20 transition-all font-semibold text-gray-900"
                  />
                ) : (
                  <p className={`text-sm bg-gray-50 rounded-2xl px-5 py-3.5 border border-gray-200 ${user.phone ? 'font-bold text-gray-900' : 'text-gray-400 font-medium'}`}>
                    {user.phone || 'No phone number added'}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  <MapPin size={14} /> Shipping Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="Provide delivery location"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800/20 transition-all font-semibold text-gray-900"
                  />
                ) : (
                  <p className={`text-sm bg-gray-50 rounded-2xl px-5 py-3.5 border border-gray-200 ${user.address ? 'font-bold text-gray-900' : 'text-gray-400 font-medium'}`}>
                    {user.address || 'No address added yet'}
                  </p>
                )}
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              {isEditing ? (
                <>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold cursor-pointer border-none hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={15} /> Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 px-6 py-3 rounded-2xl text-sm font-bold cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <X size={15} /> Cancel
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  onClick={() => { setIsEditing(true); dispatch(clearAuthStatus()); }}
                  className="flex items-center gap-2 text-sm text-gray-900 font-bold hover:text-white hover:bg-gray-900 transition-all cursor-pointer bg-gray-50 border border-gray-200 px-6 py-3 rounded-2xl"
                >
                  <Edit3 size={15} /> Edit Profile
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
      <DialogBox 
        open={dialog.open}
        onClose={closeDialog}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
};

export default Profile;