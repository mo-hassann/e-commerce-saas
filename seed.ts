import db from "./db";
import { productTable } from "./db/schemas";

const adminId = "97f15fa1-0006-4028-8ea4-7c07bf54d294";
const storeId = "a04df90d-7155-4cc3-899f-0c6e88b4ca5a";

const seedProducts = [
  {
    name: "Ergonomic Office Chair",
    description: "High-quality ergonomic office chair with adjustable lumbar support",
    price: 299.99,
    oldPrice: 349.99,

    rating: 4.5,
    adminId,
    storeId,
    reviewedNumber: 120,
    stock: 50,
    purchases: 250,
  },
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
    price: 199.99,
    oldPrice: 249.99,
    rating: 4.7,
    adminId,
    storeId,
    reviewedNumber: 350,
    stock: 100,
    purchases: 750,
  },
  {
    name: "Smart Home Security Camera",
    description: "1080p HD wireless security camera with night vision and two-way audio",
    price: 79.99,
    oldPrice: 99.99,
    rating: 4.2,
    adminId,
    storeId,
    reviewedNumber: 80,
    stock: 200,
    purchases: 300,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle, keeps drinks cold for 24 hours",
    price: 24.99,
    oldPrice: 29.99,
    rating: 4.8,
    adminId,
    storeId,
    reviewedNumber: 500,
    stock: 1000,
    purchases: 2500,
  },
  {
    name: "Yoga Mat",
    description: "Non-slip, eco-friendly yoga mat with carrying strap",
    price: 39.99,
    oldPrice: 49.99,
    rating: 4.6,
    adminId,
    storeId,
    reviewedNumber: 200,
    stock: 150,
    purchases: 600,
  },
  {
    name: "Electric Coffee Grinder",
    description: "Compact electric coffee grinder with multiple grind settings",
    price: 49.99,
    oldPrice: 59.99,
    rating: 4.4,
    adminId,
    storeId,
    reviewedNumber: 150,
    stock: 75,
    purchases: 400,
  },
  {
    name: "Portable Power Bank",
    description: "20000mAh portable power bank with fast charging capability",
    price: 59.99,
    oldPrice: 69.99,
    rating: 4.3,
    adminId,
    storeId,
    reviewedNumber: 300,
    stock: 250,
    purchases: 1000,
  },
  {
    name: "Smart LED Light Bulb",
    description: "Wi-Fi enabled color-changing smart LED bulb",
    price: 19.99,
    oldPrice: 24.99,
    rating: 4.1,
    adminId,
    storeId,
    reviewedNumber: 100,
    stock: 500,
    purchases: 800,
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with Qi-enabled devices",
    price: 29.99,
    oldPrice: 34.99,
    rating: 4.0,
    adminId,
    storeId,
    reviewedNumber: 180,
    stock: 300,
    purchases: 700,
  },
  {
    name: "Digital Kitchen Scale",
    description: "Precise digital kitchen scale with tare function and multiple units",
    price: 14.99,
    oldPrice: 19.99,
    rating: 4.5,
    adminId,
    storeId,
    reviewedNumber: 250,
    stock: 400,
    purchases: 900,
  },
];

const fun = async () => {
  try {
    await db.insert(productTable).values([...seedProducts]);
  } catch (error) {
    console.log(error);
  }
};

fun();
