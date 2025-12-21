"use client";

import { motion } from "framer-motion";
import StatsCard from "@/components/ui/StatsCard";
import Badge from "@/components/ui/Badge";

interface OverviewProps {
    stats: {
        totalRequests: number;
        pendingRequests: number;
        totalProducts: number;
        newClients: number;
    };
    requests: any[];
}

export default function DashboardOverview({ stats, requests }: OverviewProps) {
    // Simple mock data for trend chart
    const trendData = [30, 45, 35, 60, 55, 80, 75];
    const maxVal = Math.max(...trendData);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="Total Requests"
                    value={stats.totalRequests}
                    description="+12% from last month"
                />
                <StatsCard
                    label="Pending"
                    value={stats.pendingRequests}
                    textColor="text-amber-600"
                    description="Requires attention"
                />
                <StatsCard
                    label="Active Inventory"
                    value={stats.totalProducts}
                    textColor="text-indigo-600"
                    description="In stock"
                />
                <StatsCard
                    label="Unique Clients"
                    value={stats.newClients}
                    textColor="text-emerald-600"
                    description="Loyal customers"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Request Velocity</h2>
                            <p className="text-sm text-gray-500">Volume over the last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Up 24%
                        </div>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                        {trendData.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(val / maxVal) * 100}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                                    className="w-full max-w-[40px] bg-primary-500/20 group-hover:bg-primary-500 rounded-t-lg transition-colors relative"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                                        {val} reqs
                                    </div>
                                </motion.div>
                                <span className="text-[10px] font-bold text-gray-400">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {requests.slice(0, 4).map((request, i) => {
                            const itemCount = request.items.length;
                            const mainItem = request.items[0];
                            return (
                                <div
                                    key={request.id}
                                    className="flex items-start gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 border-b border-gray-50 pb-4 group-last:border-0">
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                                            {itemCount === 1 ? mainItem?.product.name : `${mainItem?.product.name} + ${itemCount - 1} more`}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {request.user.name} • {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge type={request.status} className="scale-75 origin-right">{request.status}</Badge>
                                </div>
                            );
                        })}
                        {requests.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No activity yet.</p>
                        )}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm font-bold text-primary-600 border border-primary-100 rounded-xl hover:bg-primary-50 transition-colors">
                        View All Logs
                    </button>
                </div>
            </div>
        </div>
    );
}
