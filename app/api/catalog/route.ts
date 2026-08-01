import { NextResponse } from 'next/server';

async function fetchAllCatalogObjects() {
  const objects: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const url = new URL(`${process.env.SQUARE_API_URL}/v2/catalog/list`);
    url.searchParams.set('types', 'ITEM,CATEGORY,IMAGE');
    if (cursor) url.searchParams.set('cursor', cursor);

    const response = await fetch(url.toString(), {
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
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    objects.push(...(data.objects || []));
    cursor = data.cursor;
  } while (cursor);

  return objects;
}

async function fetchAllInventoryCounts(variationIds: string[]) {
  const inventoryMap: Record<string, number> = {};
  if (variationIds.length === 0) return inventoryMap;

  let cursor: string | undefined = undefined;

  try {
    do {
      const inventoryRes: Response = await fetch(`${process.env.SQUARE_API_URL}/v2/inventory/counts/batch-retrieve`, {
        method: 'POST',
        headers: {
          'Square-Version': '2024-01-18',
          'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          catalog_object_ids: variationIds,
          states: ['IN_STOCK'],
          ...(cursor ? { cursor } : {}),
        }),
        next: { revalidate: 60 },
      });

      if (!inventoryRes.ok) break;

      const inventoryData: any = await inventoryRes.json();
      (inventoryData.counts || []).forEach((count: any) => {
        inventoryMap[count.catalog_object_id] = parseInt(count.quantity || '0', 10);
      });
      cursor = inventoryData.cursor;
    } while (cursor);
  } catch (err) {
    console.error('Inventory fetch error:', err);
  }

  return inventoryMap;
}

export async function GET() {
  try {
    const objects = await fetchAllCatalogObjects();

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

    // Fetch inventory counts from Square (paginated)
    const inventoryMap = await fetchAllInventoryCounts(allVariationIds);

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

    // Sort: pullover → polos → shorts → hats → t-shirts
    products.sort((a: any, b: any) => {
      const getTypeOrder = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('pullover') || n.includes('quarter zip') || n.includes('zip') || n.includes('vest')) return 1;
        if (n.includes('polo')) return 2;
        if (n.includes('short')) return 3; // pick where it should slot in
        if (n.includes('hat')) return 4;
        if (n.includes('tee') || n.includes('t-shirt') || n.includes('shirt')) return 5;
        if (n.includes('marker') || n.includes('chip') || n.includes('sticker') || n.includes('tees')) return 6;
        return 7;
      };
      return getTypeOrder(a.name) - getTypeOrder(b.name);
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}