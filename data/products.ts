export interface Product {
    id: number;
    name: string;
    price: string;
    category: string;
    image: string;
  }
  
  export const MOCK_PRODUCTS: Product[] = [
    {
      id: 1,
      name: "The Hickory Classic Polo",
      price: "$78.00",
      category: "Apparel",
      image: "public/mockups-02.png",
    },
    {
      id: 2,
      name: "Canvas & Leather Sunday Bag",
      price: "$245.00",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800", 
    },
    // ADD NEW PRODUCTS HERE
  ];