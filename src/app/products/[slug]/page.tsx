import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import NavbarCategory from '@/app/models/NavbarCategory';
import Category from '@/app/models/Category';
import NavbarCategoryClient from './NavbarCategoryClient';
import { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

async function getNavbarCategoryWithCategories(slug: string) {
  try {
    await connectDB();
    const navbarCategory = await NavbarCategory.findOne({ 
      slug: slug, 
      isActive: true 
    });

    if (!navbarCategory) {
      return null;
    }

    // Get all categories under this navbar category
    const categories = await Category.find({ 
      navbarCategory: navbarCategory._id, 
      isActive: true 
    }).sort({ createdAt: -1 });

    return {
      navbarCategory: JSON.parse(JSON.stringify(navbarCategory)),
      categories: JSON.parse(JSON.stringify(categories))
    };
  } catch (error) {
    console.error('Error fetching navbar category:', error);
    return null;
  }
}

export default async function NavbarCategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getNavbarCategoryWithCategories(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  return <NavbarCategoryClient data={data} />;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getNavbarCategoryWithCategories(resolvedParams.slug);
  
  if (!data) {
    return {
      title: 'Page Not Found - Huawei eKit UAE',
      description: 'The requested product category could not be found.',
    };
  }

  const { navbarCategory } = data;
  const title = `${navbarCategory.name} - Huawei eKit UAE`;
  const description = navbarCategory.description || 
    `Explore ${navbarCategory.name} categories and products at Huawei eKit UAE. Find comprehensive IT solutions and technology products for UAE businesses.`;

  return {
    title,
    description,
    keywords: `${navbarCategory.name}, Huawei products, IT solutions UAE, ${navbarCategory.name.toLowerCase()} products, Huawei eKit UAE, business technology`,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://huawei-ekit.ae/products/${resolvedParams.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}