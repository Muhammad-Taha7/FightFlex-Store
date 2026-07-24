import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateProfile, clearAuthStatus } from '../../store/authSlice';
import { 
  Mail, MapPin, Calendar, Edit3, Save, X, 
  AlertCircle, Camera, User, Phone 
} from 'lucide-react';
import SuccessModal from '../Components/SuccessModal';

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

  // Success Modal States
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState('Success!');
  const [successMsg, setSuccessMsg] = useState('Operation completed successfully.');
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
    }
  }, [isAuthenticated, navigate]);

  // Sync user state with local edit state
  useEffect(() => {
    if (user) {
      setEditData({
        username: user.username || '',
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
      setSuccessTitle('Profile Updated!');
      setSuccessMsg('Your profile details have been successfully saved.');
      setShowSuccess(true);
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
            setSuccessTitle('Avatar Updated!');
            setSuccessMsg('Your profile picture has been uploaded successfully.');
            setShowSuccess(true);
          }
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        alert(err.response?.data?.message || 'Failed to upload profile image.');
      } finally {
        setIsUploading(false);
      }
    };
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      username: user?.username || '',
      address: user?.address || '',
      phone: user?.phone || '',
    });
    dispatch(clearAuthStatus());
  };

  if (!user) return null;

  const userAvatar = user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=3b82f6&color=ffffff&size=200&bold=true`;
  
  const memberSince = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="min-h-screen pt-[5rem] md:pt-[10rem] w-full bg-slate-950 text-slate-100 py-8 px-4 sm:px-8 lg:px-12">
      <div className="w-full">
        
        {/* Success Modal */}
        <SuccessModal 
          isOpen={showSuccess} 
          onClose={() => setShowSuccess(false)} 
          title={successTitle} 
          message={successMsg} 
        />

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Account Settings</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Manage your profiles, credentials, and settings.</p>
          </div>
          <span className="self-start md:self-auto px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Profile Verified
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-400 backdrop-blur-sm shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Full-width Dark Card Wrapper */}
        <div className="w-full bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl overflow-hidden transition-all duration-300">
          
          {/* Avatar & Info Banner */}
          <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-8 sm:px-10 flex flex-col sm:flex-row items-center gap-6">
            
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img 
                src={userAvatar} 
                alt={user.username || 'User'}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-slate-800 shadow-xl transition-transform duration-300 group-hover:scale-105" 
              />
              
              {isUploading ? (
                <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200 text-white gap-1 backdrop-blur-xs">
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
              <h2 className="text-2xl font-black text-white">{user.username}</h2>
              <p className="text-slate-400 text-sm mt-0.5 font-medium">{user.email}</p>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-2 justify-center sm:justify-start font-semibold">
                <Calendar size={13} />
                <span>Joined on {memberSince}</span>
              </div>
            </div>
          </div>

          {/* Profile Form Details */}
          <form onSubmit={handleSaveInfo} className="p-6 sm:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <User size={14} /> Profile Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                  />
                ) : (
                  <p className="text-white font-bold text-sm bg-slate-950/60 rounded-2xl px-5 py-3.5 border border-slate-800">
                    {user.username}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <Mail size={14} /> Registered Email
                </label>
                <p className="text-slate-500 font-medium text-sm bg-slate-950/40 rounded-2xl px-5 py-3.5 border border-slate-800/60 select-none">
                  {user.email || '—'}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <Phone size={14} /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="Provide phone number"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                  />
                ) : (
                  <p className={`text-sm bg-slate-950/60 rounded-2xl px-5 py-3.5 border border-slate-800 ${user.phone ? 'text-white font-bold' : 'text-slate-500 font-medium'}`}>
                    {user.phone || 'No phone number added yet'}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <MapPin size={14} /> Delivery Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    placeholder="Provide delivery location"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
                  />
                ) : (
                  <p className={`text-sm bg-slate-950/60 rounded-2xl px-5 py-3.5 border border-slate-800 ${user.address ? 'text-white font-bold' : 'text-slate-500 font-medium'}`}>
                    {user.address || 'No address added yet'}
                  </p>
                )}
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              {isEditing ? (
                <>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold cursor-pointer border-none hover:bg-blue-500 transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/20"
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
                    className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-6 py-3 rounded-2xl text-sm font-bold cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    <X size={15} /> Cancel
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  onClick={() => { setIsEditing(true); dispatch(clearAuthStatus()); }}
                  className="flex items-center gap-2 text-sm text-blue-400 font-bold hover:text-white hover:bg-blue-600 transition-all cursor-pointer bg-blue-500/10 border border-blue-500/20 px-6 py-3 rounded-2xl"
                >
                  <Edit3 size={15} /> Edit Info
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Profile;