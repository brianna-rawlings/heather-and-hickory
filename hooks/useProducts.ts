import { useEffect, useState } from 'react';

export interface SquareProduct {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  variations: {
    id: string;
    name: string;
    price: string;
  }[];
}

export function useProducts() {
  const [products, setProducts] = useState<SquareProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/catalog')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setProducts(data.products);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}