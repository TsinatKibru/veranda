import React from "react";
import Badge from "./ui/Badge";

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
        product: {
            name: string;
        };
        user: {
            name: string;
            companyName?: string;
            email: string;
        };
        quantity: number;
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
    return (
        <div className={`p-6 ${!isAdmin ? "hover:bg-gray-50" : ""}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-lg">{request.product.name}</h3>
                    {isAdmin ? (
                        <>
                            <p className="text-sm text-gray-600">
                                Client: {request.user.name} ({request.user.companyName})
                            </p>
                            <p className="text-sm text-gray-600">Email: {request.user.email}</p>
                        </>
                    ) : null}
                    <p className="text-sm text-gray-600">Quantity: {request.quantity}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge type={request.status}>{request.status}</Badge>
                    {isAdmin && onStatusChange && (
                        <select
                            value={request.status}
                            onChange={(e) => onStatusChange(request.id, e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="QUOTED">Quoted</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    )}
                </div>
            </div>

            {request.notes && (
                <div className={`mb-4 p-3 ${isAdmin ? "bg-gray-50" : ""} rounded`}>
                    <p className="text-sm font-medium text-gray-700">Notes:</p>
                    <p className="text-sm text-gray-600">{request.notes}</p>
                </div>
            )}

            {(request.messages.length > 0 || selectedRequestId === request.id || !isAdmin) && (
                <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-3">Messages</h4>
                    <div className="space-y-3 mb-4">
                        {request.messages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-3 rounded-lg ${message.fromUser.role === "ADMIN" ? "bg-blue-50" : "bg-gray-100"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm">
                                        {message.fromUser.name} {isAdmin ? `(${message.fromUser.role})` : ""}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(message.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700">{message.content}</p>
                            </div>
                        ))}
                    </div>

                    <form
                        onSubmit={(e) => {
                            setSelectedRequestId(request.id);
                            onSendMessage(e, request.id, messageContent);
                        }}
                    >
                        <textarea
                            value={selectedRequestId === request.id ? messageContent : ""}
                            onChange={(e) => {
                                setSelectedRequestId(request.id);
                                setMessageContent(e.target.value);
                            }}
                            className="input-field"
                            rows={2}
                            placeholder={isAdmin ? "Reply to client..." : "Type your message..."}
                        />
                        <button
                            type="submit"
                            className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                        >
                            {isAdmin ? "Send Reply" : "Send Message"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
