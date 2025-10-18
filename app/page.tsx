"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedMaterial]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("categoryId", selectedCategory);
      if (selectedMaterial) params.append("materialId", selectedMaterial);

      const [productsRes, categoriesRes, materialsRes] = await Promise.all([
        fetch(`/api/products?${params}`),
        fetch("/api/categories"),
        fetch("/api/materials"),
      ]);

      const [productsData, categoriesData, materialsData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        materialsRes.json(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setMaterials(materialsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="relative bg-gradient-to-br from-primary-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Premium Outdoor Furniture
              <br />
              <span className="text-primary-600">Built to Last</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              High-quality plastic outdoor furniture designed for hotels,
              resorts, and commercial spaces. Durable, stylish, and sustainable.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/dashboard" className="btn-primary text-lg">
                Request a Quote
              </Link>
              <a href="#products" className="btn-secondary text-lg">
                View Products
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Our Products
            </h2>
            <p className="text-gray-600">
              Explore our collection of durable outdoor furniture
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Material
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="input-field"
              >
                <option value="">All Materials</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No products found matching your filters.
            </div>
          )}
        </div>
      </section>

      <section id="about" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About Veranda Plastics
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                For over a decade, we've been manufacturing premium outdoor
                furniture for the hospitality industry. Our products combine
                durability, style, and sustainability to meet the demanding
                needs of hotels and resorts worldwide.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We specialize in high-density plastic furniture that withstands
                harsh weather conditions while maintaining its appearance and
                structural integrity. Our commitment to quality and customer
                service has made us a trusted partner for hospitality
                professionals.
              </p>
              <Link href="/register" className="btn-primary">
                Partner With Us
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-blue-200 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    15+
                  </div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    500+
                  </div>
                  <div className="text-gray-600">Happy Clients</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    50+
                  </div>
                  <div className="text-gray-600">Product Lines</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    100%
                  </div>
                  <div className="text-gray-600">Quality Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sustainability" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Committed to Sustainability
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're dedicated to reducing our environmental impact through
              eco-friendly materials and responsible manufacturing practices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♻️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recycled Materials</h3>
              <p className="text-gray-600">
                Many of our products use recycled plastic, giving new life to
                waste materials.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Long-Lasting</h3>
              <p className="text-gray-600">
                Durable construction means less replacement and reduced waste
                over time.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Efficient Production
              </h3>
              <p className="text-gray-600">
                Our manufacturing process minimizes energy consumption and
                emissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-primary-600 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Request a quote today and discover how Veranda Plastics can elevate
            your outdoor spaces.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
