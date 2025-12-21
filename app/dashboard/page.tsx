"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StatsCard from "@/components/ui/StatsCard";
import RequestItem from "@/components/RequestItem";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if ((session.user as any).role === "ADMIN") {
        router.push("/admin");
      } else {
        fetchData();

        // Pusher Real-time Subscriptions
        const pusherClient = require("@/lib/pusher").default;
        const userId = (session.user as any).id;
        const channel = pusherClient.subscribe(`user-${userId}`);

        channel.bind("new-message", (data: any) => {
          setRequests(prev => prev.map(req => {
            if (req.id === data.quoteRequestId) {
              if (req.messages.find((m: any) => m.id === data.message.id)) return req;
              return { ...req, messages: [...req.messages, data.message] };
            }
            return req;
          }));

          setSelectedRequest((prev: any) => {
            if (prev?.id === data.quoteRequestId) {
              if (prev.messages.find((m: any) => m.id === data.message.id)) return prev;
              return { ...prev, messages: [...prev.messages, data.message] };
            }
            return prev;
          });
        });

        channel.bind("status-update", (data: any) => {
          setRequests(prev => prev.map(req => {
            if (req.id === data.quoteRequestId) {
              return { ...req, status: data.status };
            }
            return req;
          }));

          if (selectedRequest?.id === data.quoteRequestId) {
            setSelectedRequest((prev: any) => ({ ...prev, status: data.status }));
          }
        });

        return () => {
          pusherClient.unsubscribe(`user-${userId}`);
        };
      }
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      const [requestsRes, productsRes] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/products"),
      ]);
      const [requestsData, productsData] = await Promise.all([
        requestsRes.json(),
        productsRes.json(),
      ]);
      setRequests(requestsData);
      setProducts(productsData);

      if (selectedRequest) {
        const updated = requestsData.find((r: any) => r.id === selectedRequest.id);
        if (updated) setSelectedRequest(updated);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (
    e: React.FormEvent,
    quoteRequestId: string,
    content: string
  ) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteRequestId,
          content,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessageContent("");

        // Update local state immediately
        setRequests(prev => prev.map(req => {
          if (req.id === quoteRequestId) {
            if (req.messages.find((m: any) => m.id === newMessage.id)) return req;
            return { ...req, messages: [...req.messages, newMessage] };
          }
          return req;
        }));

        setSelectedRequest((prev: any) => {
          if (prev?.id === quoteRequestId) {
            if (prev.messages.find((m: any) => m.id === newMessage.id)) return prev;
            return { ...prev, messages: [...prev.messages, newMessage] };
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {session?.user?.name}!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard label="Total Requests" value={requests.length} />
          <StatsCard
            label="Pending"
            value={requests.filter((r) => r.status === "PENDING").length}
            textColor="text-yellow-600"
          />
          <StatsCard
            label="Approved"
            value={requests.filter((r) => r.status === "APPROVED").length}
            textColor="text-green-600"
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Inquiries</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Updates Enabled</span>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">No requests yet</h3>
              <p className="text-gray-500 mt-2">Browse our catalog and add items to your quote basket!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map((request) => (
                <RequestItem
                  key={request.id}
                  request={request}
                  isAdmin={false}
                  onSendMessage={handleSendMessage}
                  messageContent={messageContent}
                  setMessageContent={setMessageContent}
                  selectedRequestId={selectedRequest?.id}
                  setSelectedRequestId={(id) =>
                    setSelectedRequest(requests.find((r) => r.id === id))
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
