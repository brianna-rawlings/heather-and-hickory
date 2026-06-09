// app/shop/product/[id]/page.tsx
// Server component — fetches product data for metadata, passes id to client component

import type { Metadata } from 'next';
import ProductClient from './ProductClient';

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://heatherandhickory.com'}/api/catalog`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return data.products?.find((p: any) => p.id === id) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'This product could not be found.',
    };
  }

  const descriptionParts = product.description?.split('---') || [];
  const mainDescription = descriptionParts[0]?.trim() || '';
  const metaDescription = mainDescription
    ? `${mainDescription.slice(0, 140)}${mainDescription.length > 140 ? '...' : ''}`
    : `Shop the ${product.name} from Heather & Hickory. Golf apparel built for the course.`;

  return {
    title: product.name,
    description: metaDescription,
    openGraph: {
      title: `${product.name} | heather & hickory`,
      description: metaDescription,
      url: `https://heatherandhickory.com/shop/product/${id}`,
      images: product.image
        ? [
            {
              url: product.image,
              width: 800,
              height: 1000,
              alt: product.name,
            },
          ]
        : [],
    },
    alternates: {
      canonical: `https://heatherandhickory.com/shop/product/${id}`,
    },
  };
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProductClient params={params} />;
}