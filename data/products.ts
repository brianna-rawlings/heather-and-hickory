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
      image: "/mockups-02.png",
    },
    {
      id: 2,
      name: "Canvas & Leather Sunday Bag",
      price: "$245.00",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800",
    },
    {
      id: 3,
      name: "The Heather Linen Shirt",
      price: "$92.00",
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800",
    },
    {
      id: 4,
      name: "Vintage Rope Headcover Set",
      price: "$65.00",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1591491719565-9a443b381017?q=80&w=800",
    },
    {
      id: 5,
      name: "The Fairway Quarter-Zip",
      price: "$110.00",
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800",
    },
    {
      id: 6,
      name: "Leather Scorecard Holder",
      price: "$48.00",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800",
    },
    {
      id: 7,
      name: "The Hickory Fleece Hoodie",
      price: "$128.00",
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?q=80&w=800",
    },
    {
      id: 8,
      name: "Waxed Canvas Tote",
      price: "$85.00",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800",
    },
    // ADD NEW PRODUCTS HERE
  ];