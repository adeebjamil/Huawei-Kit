import { Metadata } from 'next';
import ProductsClient from './ProductsClient';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Product Catalog - Huawei eKit UAE',
  description: 'Browse Huawei eKit UAE comprehensive product catalog. Discover networking solutions, enterprise technology, and IT infrastructure products tailored for UAE businesses.',
  keywords: 'Huawei products, IT products UAE, networking solutions, enterprise technology, product catalog, Huawei eKit UAE, business technology',
  openGraph: {
    title: 'Product Catalog - Huawei eKit UAE',
    description: 'Browse Huawei eKit UAE comprehensive product catalog. Discover networking solutions, enterprise technology, and IT infrastructure products tailored for UAE businesses.',
    type: 'website',
    url: 'https://huawei-ekit.ae/products',
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function fetchCategories() {
  try {
    // Use relative URL for internal API calls
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/categories`, {
      cache: 'no-store' // Don't cache to always get fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, data: null };
  }
}

export default async function ProductsPage() {
  const categoriesData = await fetchCategories();
  
  return <ProductsClient initialData={categoriesData} />;
}