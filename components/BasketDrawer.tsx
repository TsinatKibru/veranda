"use client";

import { useBasketStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function BasketDrawer() {
    const { items, removeItem, updateQuantity, clearBasket } = useBasketStore();
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notes, setNotes] = useState("");

    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || !session || (session.user as any).role === 'ADMIN') return null;

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    const handleSubmitQuote = async () => {
        if (items.length === 0) return;
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
                    notes
                }),
            });

            if (response.ok) {
                clearBasket();
                setNotes("");
                setIsOpen(false);
                alert("Quote request submitted successfully!");
            }
        } catch (error) {
            console.error("Error submitting quote:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Floating Toggle */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 bg-primary-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                        {totalItems}
                    </span>
                )}
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap px-0 group-hover:px-2">
                    Review Quote
                </span>
            </motion.button>

            {/* Drawer Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Quote Request</h2>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Reviewing {items.length} materials</p>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-900">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                {items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                        <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        <p className="font-bold text-lg">Your basket is empty</p>
                                        <p className="text-sm">Add some furniture to start a quote</p>
                                    </div>
                                ) : (
                                    items.map(item => (
                                        <div key={item.productId} className="flex gap-4 p-4 border border-gray-100 rounded-2xl group relative hover:border-primary-100 transition-colors bg-white">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                <img src={item.imageUri} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 truncate pr-6">{item.name}</h4>
                                                <p className="text-xs text-primary-600 font-bold mb-3">{item.priceRange || 'Custom Price'}</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                            className="px-2 py-1 hover:bg-gray-50 text-gray-400 hover:text-gray-900"
                                                        >-</button>
                                                        <span className="px-3 py-1 font-black text-sm border-x border-gray-200">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                            className="px-2 py-1 hover:bg-gray-50 text-gray-400 hover:text-gray-900"
                                                        >+</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="absolute top-2 right-2 p-1 text-gray-300 hover:text-rose-500 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block px-1">Internal Notes (Optional)</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Special requirements, delivery dates, etc."
                                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all resize-none h-24"
                                        />
                                    </div>
                                    <button
                                        disabled={isSubmitting}
                                        onClick={handleSubmitQuote}
                                        className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Submit Quote Request</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[10px] text-center text-gray-400 font-bold px-4 leading-relaxed">
                                        Once submitted, our team will review the availability and prepare a detailed quote for you within 24 hours.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
