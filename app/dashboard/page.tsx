"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

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
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct,
          quantity: parseInt(quantity),
          notes,
        }),
      });

      if (response.ok) {
        setShowRequestForm(false);
        setSelectedProduct("");
        setQuantity("");
        setNotes("");
        fetchData();
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !messageContent.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: selectedRequest.id,
          content: messageContent,
        }),
      });

      if (response.ok) {
        setMessageContent("");
        fetchData();
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

  const getStatusColor = (status: string) => {
    switch (status) {
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
          <div className="card">
            <div className="text-sm text-gray-600">Total Requests</div>
            <div className="text-3xl font-bold text-primary-600">
              {requests.length}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">
              {requests.filter((r) => r.status === "PENDING").length}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600">Approved</div>
            <div className="text-3xl font-bold text-green-600">
              {requests.filter((r) => r.status === "APPROVED").length}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="btn-primary"
          >
            {showRequestForm ? "Cancel" : "New Quote Request"}
          </button>
        </div>

        {showRequestForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Request a Quote</h2>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.price_range}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min="1"
                  className="input-field"
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="Any special requirements or questions..."
                />
              </div>

              <button type="submit" className="btn-primary">
                Submit Request
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">My Requests</h2>
          </div>

          {requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No requests yet. Create your first quote request above!
            </div>
          ) : (
            <div className="divide-y">
              {requests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {request.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {request.quantity}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  {request.notes && (
                    <p className="text-gray-700 mb-4">{request.notes}</p>
                  )}

                  {request.messages.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium text-sm mb-3">Messages</h4>
                      <div className="space-y-3">
                        {request.messages.map((message: any) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.from_user.role === "ADMIN"
                                ? "bg-blue-50"
                                : "bg-gray-100"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-sm">
                                {message.from_user.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  message.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {message.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      <form
                        onSubmit={(e) => {
                          setSelectedRequest(request);
                          handleSendMessage(e);
                        }}
                        className="mt-4"
                      >
                        <textarea
                          value={
                            selectedRequest?.id === request.id
                              ? messageContent
                              : ""
                          }
                          onChange={(e) => {
                            setSelectedRequest(request);
                            setMessageContent(e.target.value);
                          }}
                          className="input-field"
                          rows={2}
                          placeholder="Type your message..."
                        />
                        <button
                          type="submit"
                          className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                        >
                          Send Message
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
