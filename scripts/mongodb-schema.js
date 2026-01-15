// MongoDB Schema Setup for SafarMate
// Run this script to initialize the database collections

const categories = [
  {
    _id: "cat_school_bags",
    name: "School Bags",
    description: "Durable school bags for students",
    image: "/school-bags-collection.jpg",
    order: 1,
  },
  {
    _id: "cat_backpacks",
    name: "Backpacks",
    description: "Professional and casual backpacks",
    image: "/backpacks-collection.jpg",
    order: 2,
  },
  {
    _id: "cat_travel_bags",
    name: "Travel Bags",
    description: "Large capacity travel bags",
    image: "/travel-bags-collection.jpg",
    order: 3,
  },
]

const products = [
  // School Bags
  {
    _id: "prod_school_classic",
    categoryId: "cat_school_bags",
    name: "Classic School Bag",
    description: "Ergonomic school bag with multiple compartments",
    moq: 10,
    basePrice: 12.5,
    images: ["/classic-school-bag-blue.jpg", "/school-bag-side-view.jpg"],
    specifications: {
      material: "Polyester",
      capacity: "20L",
      weight: "400g",
      compartments: 3,
      warranty: "1 year",
    },
    colors: ["Blue", "Black", "Red", "Green"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_school_premium",
    categoryId: "cat_school_bags",
    name: "Premium School Backpack",
    description: "Premium quality school backpack with laptop compartment",
    moq: 10,
    basePrice: 18.75,
    images: ["/premium-school-backpack.jpg", "/backpack-with-laptop-compartment.jpg"],
    specifications: {
      material: "Waterproof Nylon",
      capacity: "25L",
      weight: "450g",
      compartments: 5,
      warranty: "2 years",
    },
    colors: ["Black", "Navy", "Gray", "Purple"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Backpacks
  {
    _id: "prod_backpack_office",
    categoryId: "cat_backpacks",
    name: "Office Professional Backpack",
    description: "Sleek business backpack for professionals",
    moq: 10,
    basePrice: 22.0,
    images: ["/professional-office-backpack.jpg", "/business-backpack-black.jpg"],
    specifications: {
      material: "Premium Polyester",
      capacity: "30L",
      weight: "550g",
      compartments: 4,
      warranty: "2 years",
    },
    colors: ["Black", "Charcoal", "Navy", "Brown"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "prod_backpack_outdoor",
    categoryId: "cat_backpacks",
    name: "Outdoor Adventure Backpack",
    description: "Durable outdoor backpack with weather resistance",
    moq: 10,
    basePrice: 25.5,
    images: ["/outdoor-adventure-backpack-hiking.jpg", "/waterproof-outdoor-backpack.jpg"],
    specifications: {
      material: "Waterproof Nylon",
      capacity: "40L",
      weight: "650g",
      compartments: 6,
      warranty: "3 years",
    },
    colors: ["Black", "Gray", "Olive", "Navy"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Travel Bags
  {
    _id: "prod_travel_large",
    categoryId: "cat_travel_bags",
    name: "Large Travel Backpack",
    description: "Extra large travel backpack for extended trips",
    moq: 10,
    basePrice: 35.0,
    images: ["/large-travel-backpack.jpg", "/travel-bag-with-expandable-compartments.jpg"],
    specifications: {
      material: "Heavy Duty Polyester",
      capacity: "60L",
      weight: "800g",
      compartments: 7,
      warranty: "3 years",
    },
    colors: ["Black", "Gray", "Navy", "Khaki"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Connection string would be: mongodb://localhost:27017/safarmate
// Collections to create:
// 1. categories - store product categories
// 2. products - store product details
// 3. inquiries - store bulk order inquiries
// 4. admin - store admin credentials

console.log("MongoDB Schema Ready for SafarMate")
console.log("Collections needed:", ["categories", "products", "inquiries", "admin"])
console.log("Sample data prepared for", categories.length, "categories and", products.length, "products")
