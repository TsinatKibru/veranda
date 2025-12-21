'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUri: string | null;
  priceRange: string | null;
  category: { name: string } | null;
  material: { name: string } | null;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card group cursor-pointer"
    >
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
          {product.imageUri ? (
            <img
              src={product.imageUri}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {product.category && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                {product.category.name}
              </span>
            )}
            {product.material && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                {product.material.name}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-lg group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>

          {product.priceRange && (
            <p className="text-primary-600 font-semibold">
              {product.priceRange}
            </p>
          )}

          <div className="pt-4 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.preventDefault();
                require("@/lib/store").useBasketStore.getState().addItem({
                  productId: product.id,
                  name: product.name,
                  imageUri: product.imageUri || undefined,
                  priceRange: product.priceRange || undefined,
                  quantity: 1
                });
              }}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all active:scale-95"
            >
              Add to Quote
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
