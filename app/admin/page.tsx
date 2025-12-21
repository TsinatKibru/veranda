"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/admin/Sidebar";
import DashboardOverview from "@/components/admin/DashboardOverview";
import InventoryPanel from "@/components/admin/InventoryPanel";
import RequestPanel from "@/components/admin/RequestPanel";
import ProductForm from "@/components/admin/ProductForm";

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
        resetProductForm();
        fetchData();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const resetProductForm = () => {
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
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent, requestId: string, content: string) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, content }),
      });

      if (response.ok) {
        setMessageContent("");
        fetchData();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleUpdateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Securing Connection...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter((r) => r.status === "PENDING").length,
    totalProducts: products.length,
    newClients: Array.from(new Set(requests.map(r => r.user.email))).length,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <Header />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingRequests={stats.pendingRequests}
          />

          <main className="flex-1 min-w-0">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-4xl font-black text-gray-900 tracking-tight"
                >
                  {activeTab === 'dashboard' && 'Executive Overview'}
                  {activeTab === 'requests' && 'Client Requests'}
                  {activeTab === 'products' && 'Inventory Control'}
                  {activeTab === 'categories' && 'Catalog Architecture'}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-500 mt-2 font-medium"
                >
                  {activeTab === 'dashboard' && 'Monitor system performance and live activity.'}
                  {activeTab === 'requests' && 'Analyze and respond to client furniture inquiries.'}
                  {activeTab === 'products' && 'Manage high-quality outdoor furniture collection.'}
                  {activeTab === 'categories' && 'Organize products by taxonomy and material types.'}
                </motion.p>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">
                    {session?.user?.name?.[0] || 'A'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-gray-900 leading-none">{session?.user?.name || 'Administrator'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">System Root</p>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isAddingProduct ? 'form' : activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isAddingProduct ? (
                  <ProductForm
                    productForm={productForm}
                    setProductForm={setProductForm}
                    isEditing={isEditing}
                    editingProductId={editingProductId}
                    onSubmit={handleCreateProduct}
                    onCancel={() => { setIsAddingProduct(false); setIsEditing(false); resetProductForm(); }}
                    categories={categories}
                    materials={materials}
                    uploading={uploading}
                    imagePreview={imagePreview}
                    onImageChange={handleImageChange}
                    onRemoveImage={() => { setImageFile(null); setImagePreview(""); setProductForm({ ...productForm, imageUri: "" }); }}
                  />
                ) : (
                  <>
                    {activeTab === "dashboard" && <DashboardOverview stats={stats} requests={requests} />}
                    {activeTab === "requests" && (
                      <RequestPanel
                        requests={requests}
                        onStatusChange={handleUpdateRequestStatus}
                        onSendMessage={handleSendMessage}
                        messageContent={messageContent}
                        setMessageContent={setMessageContent}
                        selectedRequest={selectedRequest}
                        setSelectedRequest={setSelectedRequest}
                      />
                    )}
                    {activeTab === "products" && (
                      <InventoryPanel
                        products={products}
                        categories={categories}
                        materials={materials}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                        onAdd={() => setIsAddingProduct(true)}
                      />
                    )}
                    {activeTab === "categories" && (
                      <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                          <div className="p-8 border-b border-gray-100 bg-gray-50/30">
                            <h2 className="text-xl font-black text-gray-900">Taxonomy</h2>
                          </div>
                          <div className="p-8 space-y-4">
                            {categories.map((category) => (
                              <div key={category.id} className="p-5 border border-gray-100 rounded-2xl hover:shadow-lg hover:shadow-primary-100/20 transition-all bg-white group">
                                <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{category.name}</h4>
                                <p className="text-xs text-gray-400 mt-1">{category.description}</p>
                                <div className="mt-4 flex items-center gap-3">
                                  <span className="text-[10px] font-bold px-2 py-0.5 bg-primary-50 text-primary-700 rounded-lg">Order: {category.categoryOrder}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg">{category._count?.products || 0} Products</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                          <div className="p-8 border-b border-gray-100 bg-gray-50/30">
                            <h2 className="text-xl font-black text-gray-900">Material Science</h2>
                          </div>
                          <div className="p-8 space-y-4">
                            {materials.map((material) => (
                              <div key={material.id} className="p-5 border border-gray-100 rounded-2xl hover:shadow-lg hover:shadow-indigo-100/20 transition-all bg-white group">
                                <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{material.name}</h4>
                                <p className="text-xs text-gray-400 mt-1">{material.description}</p>
                                <div className="mt-4 flex items-center gap-3">
                                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg">{material._count?.products || 0} Products</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
