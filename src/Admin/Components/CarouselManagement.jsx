import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Image, Upload, Trash2, Loader2, Plus, Layers } from 'lucide-react';

const CarouselManagement = () => {
  const [carousels, setCarousels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const { token } = useSelector((state) => state.auth);
  const API_URL = 'http://localhost:5000/api/carousel';

  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const fetchCarousels = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setCarousels(response.data.carousels || []);
    } catch (err) {
      console.error('Failed to fetch carousels', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarousels();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!preview) return alert('Please select an image first');
    setUploadError('');
    setUploadSuccess('');
    try {
      setUploading(true);
      const response = await axios.post(
        API_URL,
        {
          image: preview,
          title,
          order: Number(order),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCarousels([response.data.carousel, ...carousels]);
      setUploadSuccess('Image uploaded successfully!');
      
      // Reset form
      setTitle('');
      setOrder(0);
      setSelectedImage(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Upload error:', err);
      const msg = err.response?.data?.message || 'Failed to upload image';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this carousel image?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarousels(carousels.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}`,
        { isActive: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCarousels(carousels.map((c) => (c._id === id ? response.data.carousel : c)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <Image className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              Home Carousel Management
            </h2>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              Manage sliding banners and promotional imagery on the storefront homepage
            </p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" />
          <span>Add New Banner</span>
        </h3>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Upload Zone */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-300">Banner Image</label>
            <div
              className={`w-full h-52 border-2 border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all ${
                preview
                  ? 'border-blue-500/50 bg-slate-950'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-950'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <span className="text-sm font-semibold text-slate-400 block">
                    Click to browse image
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    PNG, JPG or WebP (Recommended 1920x800)
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          {/* Details & Action */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1.5">
                  Title / Caption <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  placeholder="e.g. Summer Sale 50% Off"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {uploadError && (
                <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl p-3 text-sm font-medium">
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl p-3 text-sm font-medium">
                  {uploadSuccess}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading || !preview}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-blue-500 transition duration-200 cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>{uploading ? 'Uploading Image...' : 'Upload Banner'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" />
          <span>Active Carousel Banners</span>
        </h3>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : carousels.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Image className="w-12 h-12 mx-auto text-slate-700 mb-3" />
            <p className="font-semibold">No carousel images found.</p>
            <p className="text-xs text-slate-600 mt-1">Upload your first image above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carousels.map((item) => (
              <div
                key={item._id}
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title || 'Carousel slide'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-3 bg-red-500/20 text-red-400 border border-red-500/40 rounded-full hover:bg-red-500 hover:text-white transition cursor-pointer"
                        title="Delete Image"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold text-white truncate text-base">
                      {item.title || 'Untitled Banner'}
                    </h4>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Order: <strong className="text-white">{item.order}</strong>
                  </span>

                  <button
                    onClick={() => toggleStatus(item._id, item.isActive)}
                    className={`text-xs px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                      item.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Hidden'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarouselManagement;