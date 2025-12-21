import React from "react";

interface StatsCardProps {
    label: string;
    value: string | number;
    textColor?: string;
    description?: string;
    className?: string;
}

export default function StatsCard({
    label,
    value,
    textColor = "text-gray-900",
    description,
    className = "",
}: StatsCardProps) {
    return (
        <div className={`bg-white p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-primary-100/20 transition-all ${className}`}>
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{label}</div>
            <div className={`text-4xl font-black tracking-tight ${textColor}`}>{value}</div>
            {description && (
                <div className="mt-3 text-[10px] font-bold text-gray-500 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                    {description}
                </div>
            )}
        </div>
    );
}
