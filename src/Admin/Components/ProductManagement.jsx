import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
    Package, Plus, Trash2, Loader2, Search, Edit, X, Upload
} from 'lucide-react';

const CATEGORIES = ['All', 'Men', 'Women', 'Kids', 'Accessories', 'Nutrition'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const COLOR_OPTIONS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Navy', 'Grey', 'Pink', 'Orange', 'Purple', 'Brown'];

const initialForm = {
    title: '', 
    description: '', 
    price: '', 
    category: 'Men',
    sizes: [], 
    colors: [], 
    stockQuantity: '', 
    existingImages: [],
    newImages: [],    
    imagePreviews: [] 
};

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const { token } = useSelector(state => state.auth);
    const API_URL = 'http://localhost:5000/api/products';

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setProducts(response.data.products || response.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const currentTotal = form.existingImages.length + form.newImages.length;
        
        if (currentTotal + files.length > 5) {
            return alert('Maximum 5 images allowed per product.');
        }

        const newBase64s = [];
        let processed = 0;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newBase64s.push(reader.result);
                processed++;
                if (processed === files.length) {
                    setForm(f => ({
                        ...f,
                        newImages: [...f.newImages, ...newBase64s],
                        imagePreviews: [...f.imagePreviews, ...newBase64s]
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setForm(f => {
            const existingCount = f.existingImages.length;
            let updatedExisting = [...f.existingImages];
            let updatedNew = [...f.newImages];

            if (index < existingCount) {
                updatedExisting = updatedExisting.filter((_, i) => i !== index);
            } else {
                const newIndex = index - existingCount;
                updatedNew = updatedNew.filter((_, i) => i !== newIndex);
            }

            const updatedPreviews = f.imagePreviews.filter((_, i) => i !== index);

            return {
                ...f,
                existingImages: updatedExisting,
                newImages: updatedNew,
                imagePreviews: updatedPreviews
            };
        });
    };

    const toggleSize = (size) => {
        setForm(f => ({
            ...f,
            sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
        }));
    };

    const toggleColor = (color) => {
        setForm(f => ({
            ...f,
            colors: f.colors.includes(color) ? f.colors.filter(c => c !== color) : [...f.colors, color]
        }));
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setForm(initialForm);
        setError('');
    };

    const handleEditOpen = (product) => {
        setEditingProduct(product);
        const existingImgs = product.images || [];
        const existingPreviews = existingImgs.map(img => img.imageUrl || img);

        setForm({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            sizes: product.sizes || [],
            colors: product.colors || [],
            stockQuantity: product.stockQuantity,
            existingImages: existingImgs,
            newImages: [],
            imagePreviews: existingPreviews
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.title || !form.description || !form.price || !form.category) {
            return setError('Title, description, price, and category are required.');
        }
        if (form.newImages.length === 0) {
            return setError('Please add at least one product image.');
        }

        try {
            setSubmitting(true);
            const payload = {
                title: form.title,
                description: form.description,
                price: Number(form.price),
                category: form.category,
                sizes: form.sizes,
                colors: form.colors,
                stockQuantity: Number(form.stockQuantity) || 0,
                images: form.newImages
            };

            const response = await axios.post(API_URL, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProducts([response.data.product, ...products]);
            handleCloseForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.title || !form.description || !form.price || !form.category) {
            return setError('Title, description, price, and category are required.');
        }
        if (form.existingImages.length === 0 && form.newImages.length === 0) {
            return setError('Please retain or upload at least one product image.');
        }

        try {
            setSubmitting(true);
            const payload = {
                title: form.title,
                description: form.description,
                price: Number(form.price),
                category: form.category,
                sizes: form.sizes,
                colors: form.colors,
                stockQuantity: Number(form.stockQuantity) || 0,
                existingImages: form.existingImages,
                newImages: form.newImages
            };

            const response = await axios.put(`${API_URL}/${editingProduct._id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedProduct = response.data.product || response.data;
            setProducts(products.map(p => (p._id === editingProduct._id ? updatedProduct : p)));
            handleCloseForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Permanently delete this product?')) return;
        try {
            setDeleteLoading(id);
            await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete product.');
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categoryColors = {
        Men: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        Women: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
        Kids: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
        Accessories: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        Nutrition: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    };

    return (
        <div className="space-y-6 text-slate-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg">
                <div>
                    <h2 className="text-xl font-black text-white">Products Management</h2>
                    <p className="text-sm text-slate-400 mt-1">{products.length} total products across all categories</p>
                </div>
                <button
                    onClick={() => { setEditingProduct(null); setForm(initialForm); setError(''); setShowForm(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
                >
                    <Plus className="w-5 h-5" /> Add Product
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {CATEGORIES.filter(c => c !== 'All').map(cat => {
                    const count = products.filter(p => p.category === cat).length;
                    return (
                        <div key={cat} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md text-center">
                            <p className="text-2xl font-black text-white">{count}</p>
                            <p className={`text-xs font-bold mt-1 px-2.5 py-0.5 rounded-full inline-block ${categoryColors[cat] || 'bg-slate-800 text-slate-300'}`}>{cat}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex justify-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
                    <Package className="w-14 h-14 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white">No products found</h3>
                    <p className="text-sm text-slate-400 mt-1">Try a different search or category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md overflow-hidden group hover:border-slate-700 hover:shadow-xl transition-all flex flex-col justify-between">
                            <div>
                                {/* Image */}
                                <div className="h-52 bg-slate-950 relative overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[0]?.imageUrl || product.images[0]}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-12 h-12 text-slate-700" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${categoryColors[product.category] || 'bg-slate-800 text-slate-300'}`}>
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3 gap-2">
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            disabled={deleteLoading === product._id}
                                            className="p-2 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl transition-colors border border-rose-500/30"
                                        >
                                            {deleteLoading === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-white truncate">{product.title}</h3>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-lg font-black text-blue-400">PKR {Number(product.price).toLocaleString()}</span>
                                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${product.stockQuantity > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                                        </span>
                                    </div>

                                    {product.sizes && product.sizes.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {product.sizes.map(s => (
                                                <span key={s} className="text-[10px] font-bold px-1.5 py-0.5 border border-slate-700 bg-slate-800/60 rounded text-slate-300">{s}</span>
                                            ))}
                                        </div>
                                    )}

                                    {product.colors && product.colors.length > 0 && (
                                        <div className="flex gap-1.5 mt-3">
                                            {product.colors.slice(0, 6).map(c => (
                                                <span key={c} title={c} className="w-4 h-4 rounded-full border border-slate-700 shadow-inner" style={{ backgroundColor: c.toLowerCase() }} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 pt-0">
                                <div className="flex gap-2 mt-2 pt-3 border-t border-slate-800/60">
                                    <button
                                        onClick={() => handleEditOpen(product)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-700 transition"
                                    >
                                        <Edit className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-400 rounded-xl text-sm font-semibold hover:bg-rose-500 hover:text-white transition"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Overlay */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-800">
                        
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center rounded-t-3xl z-10">
                            <div>
                                <h3 className="text-xl font-black text-white">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <p className="text-sm text-slate-400">
                                    {editingProduct ? 'Update the details for this product' : 'Fill in the details for the new product'}
                                </p>
                            </div>
                            <button onClick={handleCloseForm} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={editingProduct ? handleEditSubmit : handleSubmit} className="p-6 space-y-6">
                            {error && (
                                <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl p-4 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Image Upload & Previews */}
                            <div>
                                <label className="block text-sm font-bold text-slate-200 mb-2">
                                    Product Images <span className="text-slate-400 font-normal">(max 5)</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {form.imagePreviews.map((src, i) => (
                                        <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-700">
                                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {form.imagePreviews.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-24 h-24 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-400 bg-slate-950/50 transition"
                                        >
                                            <Upload className="w-5 h-5 mb-1" />
                                            <span className="text-xs font-medium">Add</span>
                                        </button>
                                    )}
                                </div>
                                <input 
                                    ref={fileInputRef} 
                                    type="file" 
                                    accept="image/*" 
                                    multiple 
                                    className="hidden" 
                                    onChange={handleImageChange} 
                                />
                            </div>

                            {/* Title & Price */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-1">Title *</label>
                                    <input
                                        value={form.title} 
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                        placeholder="e.g. FightFlex Pro Gloves"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-1">Price (PKR) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">PKR</span>
                                        <input
                                            type="number" 
                                            value={form.price} 
                                            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                            className="w-full pl-14 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Category & Quantity */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-1">Category *</label>
                                    <select
                                        value={form.category} 
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                    >
                                        {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-200 mb-1">Stock Quantity *</label>
                                    <input
                                        type="number" 
                                        value={form.stockQuantity} 
                                        onChange={e => setForm(f => ({ ...f, stockQuantity: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-slate-200 mb-1">Description *</label>
                                <textarea
                                    value={form.description} 
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition"
                                    placeholder="Describe the product in detail..."
                                />
                            </div>

                            {/* Sizes */}
                            <div>
                                <label className="block text-sm font-bold text-slate-200 mb-2">
                                    Available Sizes <span className="text-slate-400 font-normal">(select all that apply)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SIZE_OPTIONS.map(size => (
                                        <button
                                            key={size} 
                                            type="button" 
                                            onClick={() => toggleSize(size)}
                                            className={`px-4 py-1.5 rounded-xl text-sm font-bold border transition-all ${
                                                form.sizes.includes(size) ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="block text-sm font-bold text-slate-200 mb-2">
                                    Available Colors <span className="text-slate-400 font-normal">(select all that apply)</span>
                                </label>
                                <div className="flex flex-wrap gap-2.5">
                                    {COLOR_OPTIONS.map(color => {
                                        const isSelected = form.colors.includes(color);
                                        return (
                                            <button
                                                key={color} 
                                                type="button" 
                                                onClick={() => toggleColor(color)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                                    isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                                }`}
                                            >
                                                <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-inner" style={{ backgroundColor: color.toLowerCase() }} />
                                                {color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;