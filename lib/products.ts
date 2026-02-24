export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  sizes: string[]
}

export const products: Product[] = [
  {
    id: "1",
    name: "Oversized Hoodie",
    price: 120,
    image: "/images/product-1.jpg",
    category: "Hoodies",
    description: "Heavyweight cotton oversized hoodie with dropped shoulders and ribbed cuffs. A modern essential for everyday wear.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "2",
    name: "Essential Tee",
    price: 55,
    image: "/images/product-2.jpg",
    category: "T-Shirts",
    description: "Premium cotton relaxed-fit tee with a clean neckline. The foundation of every wardrobe.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "3",
    name: "Tailored Trousers",
    price: 165,
    image: "/images/product-3.jpg",
    category: "Trousers",
    description: "Slim tailored trousers in structured wool blend. Clean lines and a modern silhouette.",
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: "4",
    name: "Leather Jacket",
    price: 420,
    image: "/images/product-4.jpg",
    category: "Outerwear",
    description: "Full-grain leather jacket with minimal hardware. A timeless statement piece.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "5",
    name: "Linen Shirt",
    price: 95,
    image: "/images/product-5.jpg",
    category: "Shirts",
    description: "Relaxed-fit linen shirt with a concealed placket. Effortless refinement for warmer days.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "6",
    name: "Wool Coat",
    price: 380,
    image: "/images/product-6.jpg",
    category: "Outerwear",
    description: "Double-faced wool coat with clean construction. Minimal structure, maximum impact.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "7",
    name: "Oversized Sweatshirt",
    price: 110,
    image: "/images/product-7.jpg",
    category: "Sweatshirts",
    description: "Brushed-back cotton sweatshirt with an oversized fit. Soft, structured, and versatile.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "8",
    name: "Tapered Joggers",
    price: 85,
    image: "/images/product-8.jpg",
    category: "Trousers",
    description: "Technical jersey joggers with a tapered leg. Elevated athleisure for the modern wardrobe.",
    sizes: ["S", "M", "L", "XL"],
  },
]
