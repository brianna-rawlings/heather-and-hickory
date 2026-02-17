import ProductCard from '@/components/ProductCard';
import { MOCK_PRODUCTS } from '@/data/products';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = await params;
  
  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase() || category === 'shop-all'
  );

  return (
    <main className="min-h-screen bg-white pt-32">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-serif italic text-[#4c2a17] capitalize mb-4">
            {category.replace('-', ' ')}
          </h1>
          <div className="h-0.5 w-24 bg-[#435e48] mx-auto"></div>
        </header>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 mb-24">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-20">No products found in this category.</p>
        )}
      </div>
    </main>
  );
}