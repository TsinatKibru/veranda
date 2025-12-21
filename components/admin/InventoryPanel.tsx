"use client";

import { useState, useMemo } from "react";
import Badge from "@/components/ui/Badge";

interface InventoryPanelProps {
    products: any[];
    categories: any[];
    materials: any[];
    onEdit: (product: any) => void;
    onDelete: (id: string) => void;
    onAdd: () => void;
}

export default function InventoryPanel({
    products,
    categories,
    materials,
    onEdit,
    onDelete,
    onAdd,
}: InventoryPanelProps) {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description?.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, search, categoryFilter]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex-1 w-full md:max-w-md relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search inventory..."
                        className="input-field pl-10 h-11 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        className="input-field h-11 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-primary-500/20 text-sm font-medium pr-8"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={onAdd}
                        className="btn-primary h-11 px-6 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-primary-200 transform active:scale-95 transition-all"
                    >
                        <span className="text-xl leading-none">+</span>
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Inventory Status</h2>
                        <p className="text-xs text-gray-500 mt-1">Found {filteredProducts.length} matching items</p>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="p-6 hover:bg-primary-50/30 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex gap-6 flex-1">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm relative">
                                        {product.imageUri ? (
                                            <img
                                                src={product.imageUri}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {product.category && (
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-50 text-gray-500 rounded-lg">{product.category.name}</span>
                                            )}
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-lg border ${product.stock > 10 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    product.stock > 0 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-rose-50 text-rose-700 border-rose-100'
                                                }`}>
                                                {product.stock} in stock
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                                    <div className="text-right">
                                        <p className="text-lg font-black text-gray-900 group-hover:text-primary-600 transition-colors">
                                            {product.priceRange}
                                        </p>
                                        <p className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${product.availability ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {product.availability ? '● Active' : '○ Disabled'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                                            title="Edit Product"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(product.id)}
                                            className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                                            title="Delete Product"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m3 3h7n-11 0h11" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredProducts.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                            <button
                                onClick={() => { setSearch(""); setCategoryFilter("all"); }}
                                className="mt-6 text-primary-600 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
