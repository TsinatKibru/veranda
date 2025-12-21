"use client";

import { motion } from "framer-motion";

interface ProductFormProps {
    productForm: any;
    setProductForm: (form: any) => void;
    isEditing: boolean;
    editingProductId: string | null;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    categories: any[];
    materials: any[];
    uploading: boolean;
    imagePreview: string;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

export default function ProductForm({
    productForm,
    setProductForm,
    isEditing,
    onSubmit,
    onCancel,
    categories,
    materials,
    uploading,
    imagePreview,
    onImageChange,
    onRemoveImage,
}: ProductFormProps) {
    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
                <h2 className="text-2xl font-black text-gray-900">
                    {isEditing ? `Edit: ${productForm.name}` : "Create New Product"}
                </h2>
                <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-primary-600 transition-colors">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    required
                                    placeholder="e.g. Modern Patio Chair"
                                    className="input-field h-12 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary-500/20 text-lg"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-primary-600 transition-colors">
                                    Description
                                </label>
                                <textarea
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    className="input-field bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary-500/20 min-h-[120px]"
                                    rows={4}
                                    placeholder="Describe the aesthetic and materials..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-primary-600 transition-colors">
                                    Category
                                </label>
                                <select
                                    value={productForm.categoryId}
                                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                                    className="input-field h-12 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-primary-600 transition-colors">
                                    Material
                                </label>
                                <select
                                    value={productForm.materialId}
                                    onChange={(e) => setProductForm({ ...productForm, materialId: e.target.value })}
                                    className="input-field h-12 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                                >
                                    <option value="">Select Material</option>
                                    {materials.map((mat) => <option key={mat.id} value={mat.id}>{mat.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-primary-600 transition-colors">
                                    Price Range
                                </label>
                                <input
                                    type="text"
                                    value={productForm.priceRange}
                                    onChange={(e) => setProductForm({ ...productForm, priceRange: e.target.value })}
                                    className="input-field h-12 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                                    placeholder="$500 - $750"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-primary-600 transition-colors">
                                    Initial Stock
                                </label>
                                <input
                                    type="number"
                                    value={productForm.stock}
                                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                                    className="input-field h-12 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="group">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                Showcase Image
                            </label>
                            <div className="space-y-4">
                                <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer bg-gray-50 hover:bg-primary-50 hover:border-primary-200 transition-all relative overflow-hidden group/img">
                                    {imagePreview ? (
                                        <div className="w-full h-full relative">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-primary-600/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <span className="text-white font-bold px-4 py-2 bg-white/20 rounded-full border border-white/30">Replace Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-10 text-center">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover/img:scale-110 transition-transform">
                                                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">Upload high-res photo</p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
                                </label>

                                {imagePreview && (
                                    <button type="button" onClick={onRemoveImage} className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
                                        </svg>
                                        Clear selection
                                    </button>
                                )}

                                {uploading && (
                                    <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm font-bold text-primary-700">Syncing with Cloudinary...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <h4 className="text-sm font-bold text-gray-900">Live Preview Ready</h4>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Changes will be published immediately to the public catalog and client dashboards.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t flex justify-between items-center">
                    <p className="text-xs text-gray-400 italic">
                        All fields except description are required for optimal indexing.
                    </p>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Save for Later
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="btn-primary px-10 py-3 shadow-xl shadow-primary-200 transform active:scale-95 transition-all flex items-center gap-2"
                        >
                            {uploading ? "Publishing..." : isEditing ? "Update Product" : "Launch Product"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
