import React from "react";

interface StatsCardProps {
    label: string;
    value: string | number;
    textColor?: string;
    className?: string;
}

export default function StatsCard({
    label,
    value,
    textColor = "text-primary-600",
    className = "",
}: StatsCardProps) {
    return (
        <div className={`card ${className}`}>
            <div className="text-sm text-gray-600">{label}</div>
            <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
        </div>
    );
}
