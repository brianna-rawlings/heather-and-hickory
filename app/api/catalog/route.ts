import { NextResponse } from 'next/server';

export async function GET() {
  try {
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

    // Build category map: id -> name
    const categoryMap: Record<string, string> = {};
    objects
      .filter((obj: any) => obj.type === 'CATEGORY')
      .forEach((obj: any) => {
        categoryMap[obj.id] = obj.category_data?.name || 'Uncategorized';
      });

    // Build image map: id -> url
    const imageMap: Record<string, string> = {};
    objects
      .filter((obj: any) => obj.type === 'IMAGE')
      .forEach((obj: any) => {
        imageMap[obj.id] = obj.image_data?.url || '';
      });

    // Transform items
    const products = objects
      .filter((obj: any) => obj.type === 'ITEM' && !obj.is_deleted)
      .map((obj: any) => {
        const item = obj.item_data;
        const firstVariation = item?.variations?.[0]?.item_variation_data;
        const priceAmount = firstVariation?.price_money?.amount || 0;
        const imageId = item?.image_ids?.[0];

        // Square uses item_data.categories[0].id (not category_id)
        const categoryId = item?.categories?.[0]?.id;
        const category = categoryId ? (categoryMap[categoryId] || 'Uncategorized') : 'Uncategorized';

        return {
          id: obj.id,
          name: item?.name || 'Unnamed Product',
          price: `$${(priceAmount / 100).toFixed(2)}`,
          category,
          image: imageId ? imageMap[imageId] : '/placeholder.png',
          variations: (item?.variations || []).map((v: any) => ({
            id: v.id,
            name: v.item_variation_data?.name || '',
            price: `$${((v.item_variation_data?.price_money?.amount || priceAmount) / 100).toFixed(2)}`,
          })),
        };
      });

    return NextResponse.json({ products });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}