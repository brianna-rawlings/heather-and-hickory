// app/shop/product/[id]/page.tsx
// Server component — fetches product data for metadata + JSON-LD schema, passes id to client component

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

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  // Build JSON-LD Product schema if product exists
  let productSchema = null;
  let breadcrumbSchema = null;

  if (product) {
    const descriptionParts = product.description?.split('---') || [];
    const mainDescription = descriptionParts[0]?.trim() || `Shop the ${product.name} from Heather & Hickory.`;
    const priceNumber = parseFloat(product.price.replace('$', '')) || 0;
    const availability = product.totalStock > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

    productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: mainDescription,
      image: product.images?.length ? product.images : [product.image],
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: 'Heather & Hickory',
      },
      category: product.category,
      offers: {
        '@type': 'Offer',
        url: `https://heatherandhickory.com/shop/product/${id}`,
        priceCurrency: 'USD',
        price: priceNumber.toFixed(2),
        availability,
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: 'Heather & Hickory',
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'US',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 30,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: priceNumber >= 50 ? '0' : '7',
            currency: 'USD',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'US',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 3,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 5,
              maxValue: 7,
              unitCode: 'DAY',
            },
          },
        },
      },
    };

    breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://heatherandhickory.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Shop',
          item: 'https://heatherandhickory.com/shop/shop-all',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name,
          item: `https://heatherandhickory.com/shop/product/${id}`,
        },
      ],
    };
  }

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <ProductClient params={params} />
    </>
  );
}