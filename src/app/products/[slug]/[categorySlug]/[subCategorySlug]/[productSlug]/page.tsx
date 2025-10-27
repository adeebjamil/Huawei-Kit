import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Product from '@/app/models/Product';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';

interface PageProps {
  params: { 
    slug: string;           // navbar category slug
    categorySlug: string;   // category slug
    subCategorySlug: string; // subcategory slug
    productSlug: string;    // product slug
  };
}

async function getProductWithHierarchy(navbarSlug: string, categorySlug: string, subCategorySlug: string, productSlug: string) {
  try {
    await connectDB();
    
    const product = await Product.findOne({ 
      slug: productSlug, 
      isActive: true 
    })
    .populate({
      path: 'navbarCategory',
      select: 'name slug'
    })
    .populate({
      path: 'category',
      select: 'name slug'
    })
    .populate({
      path: 'subcategory',
      populate: {
        path: 'category',
        populate: {
          path: 'navbarCategory',
          select: 'name slug'
        }
      }
    });

    // Verify the product belongs to the correct hierarchy
    if (!product || 
        !product.navbarCategory || 
        !product.category || 
        !product.subcategory ||
        (product.navbarCategory as any).slug !== navbarSlug ||
        (product.category as any).slug !== categorySlug ||
        (product.subcategory as any).slug !== subCategorySlug) {
      return null;
    }

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProductWithHierarchy(
    resolvedParams.slug, 
    resolvedParams.categorySlug, 
    resolvedParams.subCategorySlug, 
    resolvedParams.productSlug
  );

  if (!product) {
    notFound();
  }

  // Serialize the product data for the client component
  const productData = {
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    keyFeatures: product.keyFeatures,
    image1: product.image1,
    image2: product.image2 ?? undefined,
    image3: product.image3 ?? undefined,
    image4: product.image4 ?? undefined,
    navbarCategory: {
      name: (product.navbarCategory as any).name,
      slug: (product.navbarCategory as any).slug
    },
    category: {
      name: (product.category as any).name,
      slug: (product.category as any).slug
    },
    subcategory: {
      name: (product.subcategory as any).name,
      slug: (product.subcategory as any).slug
    }
  };

  return <ProductDetailClient product={productData} />;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductWithHierarchy(
    resolvedParams.slug, 
    resolvedParams.categorySlug, 
    resolvedParams.subCategorySlug, 
    resolvedParams.productSlug
  );
  
  if (!product) {
    return {
      title: 'Product Not Found - Huawei eKit UAE',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
        follow: false,
      }
    };
  }

  const navbarCategory = product.navbarCategory as any;
  const category = product.category as any;
  const subcategory = product.subcategory as any;

  const title = `${product.name} - ${subcategory.name} - ${category.name} - ${navbarCategory.name} - Huawei eKit UAE`;
  const description = product.description || 
    `High-quality ${product.name} from Huawei eKit UAE. Features include: ${product.keyFeatures.slice(0, 3).join(', ')}. Find detailed specifications and information about this ${subcategory.name} product.`;

  return {
    title,
    description,
    keywords: `${product.name}, ${subcategory.name}, ${category.name}, ${navbarCategory.name}, Huawei products, IT solutions UAE, networking solutions, enterprise technology, Huawei eKit UAE`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://huawei-ekit.ae/products/${resolvedParams.slug}/${resolvedParams.categorySlug}/${resolvedParams.subCategorySlug}/${resolvedParams.productSlug}`,
      images: [
        {
          url: product.image1,
          width: 800,
          height: 600,
          alt: product.name
        }
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}