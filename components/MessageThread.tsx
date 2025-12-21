import React from "react";

interface Message {
    id: string;
    fromUser: {
        name: string;
        role: "ADMIN" | "CLIENT";
    };
    content: string;
    createdAt: string;
}

interface MessageThreadProps {
    messages: Message[];
    isAdminView?: boolean;
}

export default function MessageThread({
    messages,
    isAdminView = false,
}: MessageThreadProps) {
    return (
        <div className="space-y-3 mb-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`p-3 rounded-lg ${message.fromUser.role === "ADMIN" ? "bg-blue-50" : "bg-gray-100"
                        }`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">
                            {message.fromUser.name}{" "}
                            {isAdminView ? `(${message.fromUser.role})` : ""}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">{message.content}</p>
                </div>
            ))}
        </div>
    );
}
