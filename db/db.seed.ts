import { db } from "./db";
import { productsTable, salesTable } from "./schema";

export async function seed() {
  console.log("🌱 Seeding database...");

  await db.insert(productsTable).values([
    {
      name: "Laptop Pro 15",
      category: "Electronics",
      price: 1299.99,
      stock: 45,
    },
    {
      name: "Wireless Mouse",
      category: "Electronics",
      price: 34.99,
      stock: 180,
    },
    {
      name: "Mechanical Keyboard",
      category: "Electronics",
      price: 89.99,
      stock: 120,
    },
    {
      name: '4K Monitor 27"',
      category: "Electronics",
      price: 449.99,
      stock: 60,
    },
    { name: "USB-C Hub", category: "Electronics", price: 59.99, stock: 200 },
    { name: "Webcam HD", category: "Electronics", price: 79.99, stock: 95 },
    {
      name: "Ergonomic Chair",
      category: "Furniture",
      price: 349.99,
      stock: 35,
    },
    { name: "Standing Desk", category: "Furniture", price: 549.99, stock: 25 },
    { name: "Monitor Stand", category: "Furniture", price: 49.99, stock: 80 },
    { name: "Desk Organizer", category: "Furniture", price: 29.99, stock: 150 },
    { name: "Notebook A4", category: "Stationery", price: 6.99, stock: 600 },
    {
      name: "Premium Pen Set",
      category: "Stationery",
      price: 19.99,
      stock: 250,
    },
    {
      name: "Sticky Notes Pack",
      category: "Stationery",
      price: 8.99,
      stock: 400,
    },
    {
      name: "Whiteboard Markers",
      category: "Stationery",
      price: 12.99,
      stock: 300,
    },
    { name: "Laptop Bag", category: "Accessories", price: 49.99, stock: 110 },
    {
      name: "Screen Cleaner Kit",
      category: "Accessories",
      price: 14.99,
      stock: 220,
    },
  ]);

  const customers = [
    { name: "Ahmed Raza", region: "North" },
    { name: "Sara Khan", region: "South" },
    { name: "Omar Sheikh", region: "East" },
    { name: "Fatima Ali", region: "West" },
    { name: "Bilal Hassan", region: "North" },
    { name: "Ayesha Malik", region: "South" },
    { name: "Usman Tariq", region: "East" },
    { name: "Zara Hussain", region: "West" },
    { name: "Hamza Butt", region: "North" },
    { name: "Nadia Iqbal", region: "South" },
    { name: "Faisal Chaudhry", region: "East" },
    { name: "Sana Mirza", region: "West" },
    { name: "Kamran Javed", region: "North" },
    { name: "Hina Baig", region: "South" },
    { name: "Asad Qadir", region: "East" },
    { name: "Mehreen Siddiqui", region: "West" },
    { name: "Tariq Anwar", region: "North" },
    { name: "Rabia Farooq", region: "South" },
    { name: "Danish Nawaz", region: "East" },
    { name: "Amna Yousuf", region: "West" },
  ];

  const products = [
    { id: 1, price: 1299.99 },
    { id: 2, price: 34.99 },
    { id: 3, price: 89.99 },
    { id: 4, price: 449.99 },
    { id: 5, price: 59.99 },
    { id: 6, price: 79.99 },
    { id: 7, price: 349.99 },
    { id: 8, price: 549.99 },
    { id: 9, price: 49.99 },
    { id: 10, price: 29.99 },
    { id: 11, price: 6.99 },
    { id: 12, price: 19.99 },
    { id: 13, price: 8.99 },
    { id: 14, price: 12.99 },
    { id: 15, price: 49.99 },
    { id: 16, price: 14.99 },
  ];

  // Feb 2025 — realistic pattern:
  // Week 1 (1-7): slow start
  // Week 2 (8-14): picks up
  // Week 3 (15-21): mid-month peak
  // Week 4 (22-28): month-end rush
  const salesData: {
    product_id: number;
    quantity: number;
    total_amount: number;
    sale_date: string;
    customer_name: string;
    region: string;
  }[] = [];

  const dailySalesPattern: Record<number, number> = {
    1: 3,
    2: 4,
    3: 2,
    4: 5,
    5: 3,
    6: 6,
    7: 4, // week 1
    8: 5,
    9: 6,
    10: 4,
    11: 7,
    12: 5,
    13: 8,
    14: 6, // week 2
    15: 7,
    16: 8,
    17: 6,
    18: 9,
    19: 7,
    20: 10,
    21: 8, // week 3
    22: 9,
    23: 8,
    24: 10,
    25: 12,
    26: 9,
    27: 11,
    28: 15, // week 4 rush
  };

  for (let day = 1; day <= 28; day++) {
    const numSales = dailySalesPattern[day];
    const dateStr = `2025-02-${String(day).padStart(2, "0")}`;

    for (let s = 0; s < numSales; s++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = products[Math.floor(Math.random() * products.length)];

      // Realistic quantity: mostly 1-3, occasionally bulk
      const isBulk = Math.random() < 0.1;
      const quantity = isBulk
        ? Math.floor(Math.random() * 8) + 5
        : Math.floor(Math.random() * 3) + 1;

      // Small discount on bulk
      const discount = isBulk ? 0.9 : 1;
      const total_amount = parseFloat(
        (product.price * quantity * discount).toFixed(2),
      );

      salesData.push({
        product_id: product.id,
        quantity,
        total_amount,
        sale_date: dateStr,
        customer_name: customer.name,
        region: customer.region,
      });
    }
  }

  await db.insert(salesTable).values(salesData);

  console.log(`✅ Seeded ${salesData.length} sales for February 2025!`);
}

seed();
