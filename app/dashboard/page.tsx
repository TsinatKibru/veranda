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
          productId: selectedProduct,
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

  const handleSendMessage = async (
    e: React.FormEvent,
    requestId: string,
    content: string
  ) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestId,
          content: content,
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
                      {product.name} - {product.priceRange}
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
