"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import StatsCard from "@/components/ui/StatsCard";
import Badge from "@/components/ui/Badge";
import RequestItem from "@/components/RequestItem";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    materialId: "",
    priceRange: "",
    imageUri: "",
    productImageUrls: [] as string[],
    availability: true,
    stock: 0,
    specs: {} as any,
  });

  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [messageContent, setMessageContent] = useState("");

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
      let imageUrl = productForm.imageUri;

      if (imageFile) {
        const uploadedUrl = await handleImageUpload();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const productData = {
        ...productForm,
        stock: Number(productForm.stock),
        imageUri: imageUrl,
      };

      let response;
      if (isEditing && editingProductId) {
        response = await fetch(`/api/products/${editingProductId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      } else {
        response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }

      if (response.ok) {
        setIsAddingProduct(false);
        setIsEditing(false);
        setEditingProductId(null);
        setProductForm({
          name: "",
          description: "",
          categoryId: "",
          materialId: "",
          priceRange: "",
          imageUri: "",
          productImageUrls: [],
          availability: true,
          stock: 0,
          specs: {},
        });
        setImageFile(null);
        setImagePreview("");
        fetchData();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEditProduct = (product: any) => {
    setProductForm({
      name: product.name,
      description: product.description || "",
      categoryId: product.categoryId || "",
      materialId: product.materialId || "",
      priceRange: product.priceRange || "",
      imageUri: product.imageUri || "",
      productImageUrls: product.productImageUrls || [],
      availability: product.availability,
      stock: product.stock,
      specs: product.specs || {},
    });
    setEditingProductId(product.id);
    setIsEditing(true);
    setIsAddingProduct(true);
    setImagePreview(product.imageUri || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
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
    newClients: requests.reduce((acc: string[], r: any) => {
      if (!acc.includes(r.user.email)) acc.push(r.user.email);
      return acc;
    }, []).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your products and requests
            </p>
          </div>
        </div>

        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-4 px-4 font-medium transition-colors ${activeTab === "dashboard"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-4 px-4 font-medium transition-colors ${activeTab === "requests"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Requests ({stats.pendingRequests})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-4 px-4 font-medium transition-colors ${activeTab === "products"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-4 px-4 font-medium transition-colors ${activeTab === "categories"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Categories
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard label="Total Requests" value={stats.totalRequests} />
              <StatsCard
                label="Pending Requests"
                value={stats.pendingRequests}
                textColor="text-yellow-600"
              />
              <StatsCard
                label="Total Products"
                value={stats.totalProducts}
                textColor="text-blue-600"
              />
              <StatsCard
                label="Active Clients"
                value={stats.newClients}
                textColor="text-green-600"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Requests</h2>
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {request.user.name} • {request.user.companyName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Quantity: {request.quantity} • Submitted {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge type={request.status}>{request.status}</Badge>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No requests found yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold">Quote Requests</h2>
              <p className="text-sm text-gray-500">Manage and respond to client inquiries</p>
            </div>
            <div className="divide-y divide-gray-100">
              {requests.map((request) => (
                <RequestItem
                  key={request.id}
                  request={request}
                  isAdmin={true}
                  onStatusChange={handleUpdateRequestStatus}
                  onSendMessage={handleSendMessage}
                  messageContent={messageContent}
                  setMessageContent={setMessageContent}
                  selectedRequestId={selectedRequest?.id}
                  setSelectedRequestId={(id) =>
                    setSelectedRequest(requests.find((r) => r.id === id))
                  }
                />
              ))}
              {requests.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No requests to display.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-8">
            <div className="flex justify-start">
              <button
                onClick={() => {
                  if (isAddingProduct) {
                    setIsAddingProduct(false);
                    setIsEditing(false);
                    setEditingProductId(null);
                    setProductForm({
                      name: "",
                      description: "",
                      categoryId: "",
                      materialId: "",
                      priceRange: "",
                      imageUri: "",
                      productImageUrls: [],
                      availability: true,
                      stock: 0,
                      specs: {},
                    });
                    setImagePreview("");
                  } else {
                    setIsAddingProduct(true);
                  }
                }}
                className={`btn-primary flex items-center gap-2 ${isAddingProduct ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
              >
                {isAddingProduct ? (
                  <>
                    <span className="text-lg">×</span> Cancel
                  </>
                ) : (
                  <>
                    <span className="text-lg">+</span> Add New Product
                  </>
                )}
              </button>
            </div>

            {isAddingProduct && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">
                  {isEditing ? `Edit Product: ${productForm.name}` : "Create New Product"}
                </h2>
                <form onSubmit={handleCreateProduct} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                          className="input-field min-h-[120px]"
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category
                          </label>
                          <select
                            value={productForm.categoryId}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                categoryId: e.target.value,
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
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Material
                          </label>
                          <select
                            value={productForm.materialId}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                materialId: e.target.value,
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

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Price Range
                          </label>
                          <input
                            type="text"
                            value={productForm.priceRange}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                priceRange: e.target.value,
                              })
                            }
                            className="input-field"
                            placeholder="$50 - $75"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Available Stock
                          </label>
                          <input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                stock: Number(e.target.value),
                              })
                            }
                            className="input-field"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Main Product Image
                        </label>
                        <div className="space-y-4">
                          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group">
                            {imagePreview ? (
                              <div className="w-full h-full relative">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white font-medium">Change Image</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload</p>
                                <p className="text-xs text-gray-400">PNG or JPG (MAX. 5MB)</p>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>

                          {imagePreview && (
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview("");
                                setProductForm({ ...productForm, imageUri: "" });
                              }}
                              className="text-sm text-red-600 font-medium hover:text-red-700"
                            >
                              Remove Image
                            </button>
                          )}

                          {uploading && (
                            <div className="flex items-center gap-2 text-primary-600 font-medium animate-pulse">
                              <div className="w-4 h-4 rounded-full border-2 border-primary-600 border-t-transparent animate-spin"></div>
                              Uploading to Cloudinary...
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2">Form Summary</h4>
                        <p className="text-sm text-gray-600">
                          {isEditing
                            ? "Updates will be applied immediately to the website."
                            : "New products will be added to the public catalog immediately."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setIsEditing(false);
                        setEditingProductId(null);
                        setImagePreview("");
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-8 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                    >
                      {uploading ? "Saving..." : isEditing ? "Save Changes" : "Publish Product"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Product List</h2>
                <span className="text-sm text-gray-500 font-medium">{products.length} Products</span>
              </div>
              <div className="divide-y divide-gray-100">
                {products.map((product) => (
                  <div key={product.id} className="p-6 hover:bg-gray-50 transition-all group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex gap-6 flex-1">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                          {product.imageUri ? (
                            <img
                              src={product.imageUri}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 leading-tight">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {product.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {product.category && (
                              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full border border-primary-100">
                                {product.category.name}
                              </span>
                            )}
                            {product.material && (
                              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full border border-gray-100">
                                {product.material.name}
                              </span>
                            )}
                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-100">
                              {product.stock} in stock
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                        <div className="text-right">
                          <p className="text-xl font-black text-gray-900">
                            {product.priceRange}
                          </p>
                          <p className={`text-xs font-bold mt-1 ${product.availability ? 'text-green-600' : 'text-red-600'}`}>
                            {product.availability ? '● Available' : '○ Out of Stock'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors title='Edit Product'"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors title='Delete Product'"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m3 3h7n-11 0h11" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="p-20 text-center text-gray-500">
                    <p className="text-lg font-medium">No products in catalog</p>
                    <p className="text-sm">Click "Add New Product" to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Categories</h2>
              </div>
              <div className="divide-y divide-gray-100 p-6 space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-5 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            Order: {category.categoryOrder}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                            {category._count?.products || 0} products
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Materials</h2>
              </div>
              <div className="divide-y divide-gray-100 p-6 space-y-4">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="p-5 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-900">{material.name}</h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {material.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                            {material._count?.products || 0} products
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
