'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  productCount?: number;
}

interface ProductsClientProps {
  initialData: {
    success: boolean;
    data?: Category[];
  };
}

const ProductsClient: React.FC<ProductsClientProps> = ({ initialData }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(!initialData.success);
  const [error, setError] = useState<string | null>(initialData.success ? null : 'Failed to load categories');

  useEffect(() => {
    if (initialData.success && initialData.data) {
      setCategories(initialData.data);
      setIsLoading(false);
    } else if (!initialData.success) {
      fetchCategoriesClient();
    }
  }, [initialData]);

  const fetchCategoriesClient = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success && data.data) {
        setCategories(data.data);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error loading categories');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchCategoriesClient}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner/first.jpg"
            alt="Products Banner"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-red-900/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center px-4 py-2 bg-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-full mb-6">
              <span className="text-red-300 text-sm font-semibold tracking-wide">PRODUCT CATALOG</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Explore Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Product Categories
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mb-8">
              Browse by category to find the perfect solution for your needs
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg className="w-full h-12 md:h-16 text-white" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 48h1440V0C1440 0 1200 48 720 48S0 0 0 0v48z" fill="currentColor"/>
          </svg>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Product <span className="text-red-600">Categories</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Select a category to explore our products
          </p>
        </motion.div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/products/${category.slug}`}>
                  <div className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-red-500 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Image */}
                    {category.image && (
                      <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                    )}
                    
                    <div className="relative p-8">
                      <div className="flex items-center justify-between mb-6">
                        {!category.image && (
                          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                        )}
                        <div className={`flex items-center gap-2 text-red-600 group-hover:gap-3 transition-all ${category.image ? 'ml-auto' : ''}`}>
                          <span className="font-semibold">Explore</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                        {category.name}
                      </h3>
                      
                      {category.description && (
                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                          {category.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>View subcategories & products</span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Available</h3>
            <p className="text-gray-600">Please check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsClient;
