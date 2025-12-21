"use client";

import RequestItem from "@/components/RequestItem";

interface RequestPanelProps {
    requests: any[];
    onStatusChange: (id: string, status: string) => void;
    onSendMessage: (e: React.FormEvent, id: string, content: string) => void;
    messageContent: string;
    setMessageContent: (content: string) => void;
    selectedRequest: any;
    setSelectedRequest: (request: any) => void;
}

export default function RequestPanel({
    requests,
    onStatusChange,
    onSendMessage,
    messageContent,
    setMessageContent,
    selectedRequest,
    setSelectedRequest,
}: RequestPanelProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Communication Center</h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                    Manage and respond to client furniture inquiries in real-time.
                </p>
            </div>

            <div className="space-y-4">
                {requests.map((request) => (
                    <RequestItem
                        key={request.id}
                        request={request}
                        isAdmin={true}
                        onStatusChange={onStatusChange}
                        onSendMessage={onSendMessage}
                        messageContent={messageContent}
                        setMessageContent={setMessageContent}
                        selectedRequestId={selectedRequest?.id}
                        setSelectedRequestId={(id) =>
                            setSelectedRequest(requests.find((r) => r.id === id))
                        }
                    />
                ))}
                {requests.length === 0 && (
                    <div className="p-20 text-center bg-white rounded-3xl border border-gray-100 border-dashed">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No requests yet</h3>
                        <p className="text-gray-500 mt-2">New messages from clients will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
