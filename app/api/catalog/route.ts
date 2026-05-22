import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch catalog
    const response = await fetch(`${process.env.SQUARE_API_URL}/v2/catalog/list?types=ITEM,CATEGORY,IMAGE`, {
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Square catalog error:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    const data = await response.json();
    const objects = data.objects || [];

    // Build category map
    const categoryMap: Record<string, string> = {};
    objects
      .filter((obj: any) => obj.type === 'CATEGORY')
      .forEach((obj: any) => {
        categoryMap[obj.id] = obj.category_data?.name || 'Uncategorized';
      });

    // Build image map
    const imageMap: Record<string, string> = {};
    objects
      .filter((obj: any) => obj.type === 'IMAGE')
      .forEach((obj: any) => {
        imageMap[obj.id] = obj.image_data?.url || '';
      });

    // Collect all variation IDs for inventory lookup
    const allVariationIds: string[] = [];
    objects
      .filter((obj: any) => obj.type === 'ITEM' && !obj.is_deleted)
      .forEach((obj: any) => {
        (obj.item_data?.variations || []).forEach((v: any) => {
          allVariationIds.push(v.id);
        });
      });

    // Fetch inventory counts from Square
    const inventoryMap: Record<string, number> = {};
    if (allVariationIds.length > 0) {
      try {
        const inventoryRes = await fetch(`${process.env.SQUARE_API_URL}/v2/inventory/counts/batch-retrieve`, {
          method: 'POST',
          headers: {
            'Square-Version': '2024-01-18',
            'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            catalog_object_ids: allVariationIds,
            states: ['IN_STOCK'],
          }),
          next: { revalidate: 60 },
        });

        if (inventoryRes.ok) {
          const inventoryData = await inventoryRes.json();
          (inventoryData.counts || []).forEach((count: any) => {
            inventoryMap[count.catalog_object_id] = parseInt(count.quantity || '0', 10);
          });
        }
      } catch (err) {
        console.error('Inventory fetch error:', err);
      }
    }

    // Transform items
    const products = objects
      .filter((obj: any) => obj.type === 'ITEM' && !obj.is_deleted)
      .map((obj: any) => {
        const item = obj.item_data;
        const firstVariation = item?.variations?.[0]?.item_variation_data;
        const priceAmount = firstVariation?.price_money?.amount || 0;

        const imageIds: string[] = item?.image_ids || [];
        const images = imageIds.map((imgId: string) => imageMap[imgId]).filter(Boolean);
        const firstImage = images[0] || '/placeholder.png';

        const categoryId = item?.categories?.[0]?.id;
        const category = categoryId ? (categoryMap[categoryId] || 'Uncategorized') : 'Uncategorized';
        const description = item?.description_plaintext || item?.description || '';
        const name: string = item?.name || 'Unnamed Product';

        // Total stock across all variations
        const totalStock = (item?.variations || []).reduce((sum: number, v: any) => {
          return sum + (inventoryMap[v.id] || 0);
        }, 0);

        return {
          id: obj.id,
          name,
          price: `$${(priceAmount / 100).toFixed(2)}`,
          category,
          image: firstImage,
          images,
          description,
          totalStock,
          variations: (item?.variations || []).map((v: any) => ({
            id: v.id,
            name: v.item_variation_data?.name || '',
            price: `$${((v.item_variation_data?.price_money?.amount || priceAmount) / 100).toFixed(2)}`,
            stock: inventoryMap[v.id] ?? 999, // 999 means not tracked
          })),
        };
      });

    // Sort: pullover → polos → hats → t-shirts
    products.sort((a: any, b: any) => {
      const getTypeOrder = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('pullover') || n.includes('quarter zip') || n.includes('zip') || n.includes('vest')) return 1;
    if (n.includes('polo')) return 2;
    if (n.includes('hat')) return 3;
    if (n.includes('tee') || n.includes('t-shirt') || n.includes('shirt')) return 4;
    if (n.includes('marker') || n.includes('chip') || n.includes('sticker') || n.includes('tees')) return 5;
    return 6;
      };
      return getTypeOrder(a.name) - getTypeOrder(b.name);
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}