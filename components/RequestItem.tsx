"use client";

import React from "react";
import Badge from "./ui/Badge";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    fromUser: {
        name: string;
        role: "ADMIN" | "CLIENT";
    };
    content: string;
    createdAt: string;
}

interface RequestItemProps {
    request: {
        id: string;
        items: {
            id: string;
            quantity: number;
            product: {
                name: string;
                imageUri?: string;
                priceRange?: string;
                stock?: number;
            };
        }[];
        user: {
            name: string;
            companyName?: string;
            email: string;
        };
        status: string;
        createdAt: string;
        notes?: string;
        messages: Message[];
    };
    isAdmin?: boolean;
    onStatusChange?: (requestId: string, status: string) => void;
    onSendMessage: (e: React.FormEvent, requestId: string, content: string) => void;
    messageContent: string;
    setMessageContent: (content: string) => void;
    selectedRequestId: string | null;
    setSelectedRequestId: (id: string) => void;
}

export default function RequestItem({
    request,
    isAdmin = false,
    onStatusChange,
    onSendMessage,
    messageContent,
    setMessageContent,
    selectedRequestId,
    setSelectedRequestId,
}: RequestItemProps) {
    const isSelected = selectedRequestId === request.id;
    const itemsCount = request.items.length;
    const mainItem = request.items[0];

    return (
        <div
            className={`group transition-all duration-300 ${isSelected ? "bg-white shadow-2xl z-10 scale-[1.02] mx-2 my-6 rounded-3xl border-2 border-primary-100" : "hover:bg-gray-50/80"
                }`}
        >
            <div
                className="p-8 cursor-pointer"
                onClick={() => setSelectedRequestId(request.id)}
            >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    <div className="flex gap-6 flex-1">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white flex-shrink-0 relative">
                            {mainItem?.product.imageUri ? (
                                <img
                                    src={mainItem.product.imageUri}
                                    alt={mainItem.product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            {itemsCount > 1 && (
                                <div className="absolute inset-0 bg-primary-600/60 backdrop-blur-sm flex items-center justify-center">
                                    <span className="text-white font-black text-xl">+{itemsCount - 1}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="font-black text-2xl text-gray-900 tracking-tight">
                                    {itemsCount === 1 ? mainItem?.product.name : `Quote Request for ${itemsCount} items`}
                                </h3>
                                <Badge type={request.status}>{request.status}</Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                                <div className="flex items-center gap-1.5 text-primary-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                                    Catalog Quotation
                                </div>
                                <div className="text-gray-400">|</div>
                                <div className="text-gray-500">
                                    Items: <span className="text-gray-900">{itemsCount}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 font-medium uppercase tracking-widest">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Received {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-6 w-full lg:w-auto">
                        {isAdmin && (
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 w-full lg:w-64">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Client Identity</p>
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{request.user.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{request.user.companyName || "Private Buyer"}</p>
                                <p className="text-xs text-primary-600 font-medium mt-1 truncate">{request.user.email}</p>
                            </div>
                        )}

                        {isAdmin && onStatusChange && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-400">MOVE TO:</span>
                                <select
                                    value={request.status}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => onStatusChange(request.id, e.target.value)}
                                    className="bg-white border-2 border-gray-100 text-sm font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="QUOTED">Quoted</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {request.notes && (
                    <div className={`mt-6 p-5 bg-amber-50/50 rounded-2xl border border-amber-100/50 relative overflow-hidden group/note ${isSelected ? "opacity-100" : "opacity-80 group-hover:opacity-100 transition-opacity"}`}>
                        <div className="absolute top-0 right-0 p-3">
                            <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.464 15.657a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 18a8 8 0 100-16 8 8 0 000 16z" />
                            </svg>
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Client Instructions</h4>
                        <p className="text-sm text-amber-900 leading-relaxed font-medium">{request.notes}</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50/30 rounded-b-3xl border-t border-gray-100"
                    >
                        <div className="p-8">
                            <div className="mb-10">
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Requested Items</h4>
                                <div className="grid gap-4">
                                    {request.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 group/item hover:border-primary-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                                    {item.product.imageUri ? (
                                                        <img src={item.product.imageUri} alt={item.product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{item.product.name}</p>
                                                    <p className="text-xs font-semibold text-primary-600">{item.product.priceRange || "Price on Quote"}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</p>
                                                <p className="text-lg font-black text-gray-900 leading-none">{item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Communication History</h4>
                                <div className="h-[1px] flex-1 bg-gray-100 mx-6"></div>
                                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{request.messages.length} Messages</span>
                            </div>

                            <div className="space-y-6 mb-10 min-h-[100px] max-h-[500px] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-200">
                                {request.messages.map((message) => {
                                    const isFromAdmin = message.fromUser.role === "ADMIN";
                                    const isSelf = isAdmin ? isFromAdmin : !isFromAdmin;

                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`max-w-[80%] flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
                                                <div className="flex items-center gap-2 mb-1.5 px-1">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        {message.fromUser.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-300">•</span>
                                                    <span className="text-[10px] font-bold text-gray-300">
                                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${isSelf
                                                        ? "bg-primary-600 text-white rounded-tr-none shadow-primary-100"
                                                        : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                                                        }`}
                                                >
                                                    {message.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {request.messages.length === 0 && (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                            <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-bold text-gray-400">No messages yet. Start the conversation!</p>
                                    </div>
                                )}
                            </div>

                            <form
                                className="relative"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    onSendMessage(e, request.id, messageContent);
                                }}
                            >
                                <div className="relative group/input">
                                    <textarea
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        className="w-full bg-white border-2 border-gray-100 rounded-2xl p-6 pr-24 text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all min-h-[100px] shadow-sm resize-none"
                                        placeholder={isAdmin ? "Type your reply to the client..." : "Describe your request details..."}
                                    />
                                    <div className="absolute right-3 bottom-3">
                                        <button
                                            type="submit"
                                            disabled={!messageContent.trim()}
                                            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-200 hover:bg-primary-700 disabled:opacity-50 disabled:shadow-none disabled:bg-gray-300 transition-all flex items-center gap-2 transform active:scale-95"
                                        >
                                            <span>Send</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
