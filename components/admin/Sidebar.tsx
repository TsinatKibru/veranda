"use client";

import { motion } from "framer-motion";

interface SidebarItemProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: (id: string) => void;
    badge?: number;
}

const SidebarItem = ({ id, label, icon, active, onClick, badge }: SidebarItemProps) => (
    <button
        onClick={() => onClick(id)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? "bg-primary-600 text-white shadow-lg shadow-primary-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
    >
        <div className="flex items-center gap-3">
            <div className={`${active ? "text-white" : "text-gray-400 group-hover:text-primary-600"}`}>
                {icon}
            </div>
            <span className="font-medium">{label}</span>
        </div>
        {badge !== undefined && badge > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? "bg-white text-primary-600" : "bg-primary-100 text-primary-700"
                }`}>
                {badge}
            </span>
        )}
    </button>
);

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    pendingRequests: number;
}

export default function AdminSidebar({ activeTab, setActiveTab, pendingRequests }: SidebarProps) {
    const menuItems = [
        {
            id: "dashboard",
            label: "Overview",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
        },
        {
            id: "requests",
            label: "Requests",
            badge: pendingRequests,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
        },
        {
            id: "products",
            label: "Inventory",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            id: "categories",
            label: "Catalog",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
        },
    ];

    return (
        <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-2">
                <div className="px-4 mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Main Menu
                    </h3>
                </div>
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            {...item}
                            active={activeTab === item.id}
                            onClick={setActiveTab}
                        />
                    ))}
                </div>

                <div className="pt-8 px-4">
                    <div className="p-4 bg-gradient-to-br from-primary-50 to-indigo-50 rounded-2xl border border-primary-100">
                        <p className="text-xs font-bold text-primary-700 uppercase mb-1">Status</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium text-gray-700">Live System</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
