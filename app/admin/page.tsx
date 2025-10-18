"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);

  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category_id: "",
    material_id: "",
    price_range: "",
    stock: "",
    image_uri: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [messageContent, setMessageContent] = useState("");
  const [requestStatus, setRequestStatus] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if ((session.user as any).role !== "ADMIN") {
        router.push("/dashboard");
      } else {
        fetchData();
      }
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      const [requestsRes, productsRes, categoriesRes, materialsRes] =
        await Promise.all([
          fetch("/api/requests"),
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/materials"),
        ]);

      const [requestsData, productsData, categoriesData, materialsData] =
        await Promise.all([
          requestsRes.json(),
          productsRes.json(),
          categoriesRes.json(),
          materialsRes.json(),
        ]);

      setRequests(requestsData);
      setProducts(productsData);
      setCategories(categoriesData);
      setMaterials(materialsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.secure_url;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
    return null;
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = productForm.image_uri;

      if (imageFile) {
        const uploadedUrl = await handleImageUpload();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          stock: parseInt(productForm.stock),
          image_uri: imageUrl,
        }),
      });

      if (response.ok) {
        setShowProductForm(false);
        setProductForm({
          name: "",
          description: "",
          category_id: "",
          material_id: "",
          price_range: "",
          stock: "",
          image_uri: "",
        });
        setImageFile(null);
        setImagePreview("");
        fetchData();
      }
    } catch (error) {
      console.error("Error creating product:", error);
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

  const handleUpdateRequestStatus = async (
    requestId: string,
    status: string
  ) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter((r) => r.status === "PENDING").length,
    totalProducts: products.length,
    newClients: requests.reduce((acc, r) => {
      if (!acc.includes(r.user.email)) acc.push(r.user.email);
      return acc;
    }, []).length,
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your products and requests
          </p>
        </div>

        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-4 px-4 font-medium ${
              activeTab === "dashboard"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-4 px-4 font-medium ${
              activeTab === "requests"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600"
            }`}
          >
            Requests ({stats.pendingRequests})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 px-4 font-medium ${
              activeTab === "products"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-4 px-4 font-medium ${
              activeTab === "categories"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600"
            }`}
          >
            Categories
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="text-sm text-gray-600">Total Requests</div>
                <div className="text-3xl font-bold text-primary-600">
                  {stats.totalRequests}
                </div>
              </div>
              <div className="card">
                <div className="text-sm text-gray-600">Pending Requests</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {stats.pendingRequests}
                </div>
              </div>
              <div className="card">
                <div className="text-sm text-gray-600">Total Products</div>
                <div className="text-3xl font-bold text-blue-600">
                  {stats.totalProducts}
                </div>
              </div>
              <div className="card">
                <div className="text-sm text-gray-600">Active Clients</div>
                <div className="text-3xl font-bold text-green-600">
                  {stats.newClients}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{request.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {request.user.name} ({request.user.companyName})
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {request.quantity}
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
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">All Requests</h2>
            </div>
            <div className="divide-y">
              {requests.map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {request.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Client: {request.user.name} ({request.user.companyName})
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {request.user.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {request.quantity}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                      <select
                        value={request.status}
                        onChange={(e) =>
                          handleUpdateRequestStatus(request.id, e.target.value)
                        }
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="QUOTED">Quoted</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">
                        Notes:
                      </p>
                      <p className="text-sm text-gray-600">{request.notes}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-3">Messages</h4>
                    <div className="space-y-3 mb-4">
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
                              {message.from_user.name} ({message.from_user.role}
                              )
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
                        placeholder="Reply to client..."
                      />
                      <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                      >
                        Send Reply
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="btn-primary"
              >
                {showProductForm ? "Cancel" : "Add New Product"}
              </button>
            </div>

            {showProductForm && (
              <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      className="input-field"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={productForm.category_id}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            category_id: e.target.value,
                          })
                        }
                        className="input-field"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material
                      </label>
                      <select
                        value={productForm.material_id}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            material_id: e.target.value,
                          })
                        }
                        className="input-field"
                      >
                        <option value="">Select Material</option>
                        {materials.map((mat) => (
                          <option key={mat.id} value={mat.id}>
                            {mat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <input
                        type="text"
                        value={productForm.price_range}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price_range: e.target.value,
                          })
                        }
                        className="input-field"
                        placeholder="$50 - $75"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            stock: e.target.value,
                          })
                        }
                        className="input-field"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="input-field"
                      />
                      {imagePreview && (
                        <div className="relative w-32 h-32">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview("");
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {uploading && (
                        <div className="text-sm text-primary-600">
                          Uploading image...
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading..." : "Create Product"}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">All Products</h2>
              </div>
              <div className="divide-y">
                {products.map((product) => (
                  <div key={product.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {product.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {product.category && (
                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                              {product.category.name}
                            </span>
                          )}
                          {product.material && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {product.material.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary-600">
                          {product.price_range}
                        </p>
                        <p className="text-sm text-gray-600">
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Categories & Materials</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="p-4 border rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-gray-600">
                            {category.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {category._count?.products || 0} products
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Materials</h3>
                  <div className="space-y-3">
                    {materials.map((material) => (
                      <div
                        key={material.id}
                        className="p-4 border rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-medium">{material.name}</h4>
                          <p className="text-sm text-gray-600">
                            {material.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {material._count?.products || 0} products
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
