import React from "react";

type BadgeType = "PENDING" | "QUOTED" | "APPROVED" | "REJECTED" | string;

interface BadgeProps {
    type: BadgeType;
    children: React.ReactNode;
    className?: string;
}

const getStatusColor = (type: BadgeType) => {
    switch (type) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800";
        case "QUOTED":
            return "bg-blue-100 text-blue-800";
        case "APPROVED":
            return "bg-green-100 text-green-800";
        case "REJECTED":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default function Badge({ type, children, className = "" }: BadgeProps) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                type
            )} ${className}`}
        >
            {children}
        </span>
    );
}
