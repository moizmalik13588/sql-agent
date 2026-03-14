import { db } from "./db";
import { productsTable, salesTable } from "./schema";

export async function seed() {
  try {
    console.log("🌱 Cleaning old data...");
    // Order zaroori hai: Pehle sales (child) phir products (parent) delete karein
    await db.delete(salesTable);
    await db.delete(productsTable);

    console.log("📦 Inserting products...");
    const products = await db
      .insert(productsTable)
      .values([
        { name: "Laptop", category: "Electronics", price: 999.99, stock: 50 },
        { name: "Mouse", category: "Electronics", price: 25.99, stock: 200 },
        { name: "Keyboard", category: "Electronics", price: 75.0, stock: 150 },
        { name: "Monitor", category: "Electronics", price: 299.99, stock: 75 },
        { name: "Desk Chair", category: "Furniture", price: 199.99, stock: 40 },
        { name: "Desk", category: "Furniture", price: 399.99, stock: 30 },
        { name: "Notebook", category: "Stationery", price: 5.99, stock: 500 },
        { name: "Pen Set", category: "Stationery", price: 12.99, stock: 300 },
      ])
      .returning(); // Is se humein confirmed IDs mil jayengi

    console.log("💰 Inserting sales (including February)...");

    // Yahan hum February ki dates manually add kar rahe hain
    await db.insert(salesTable).values([
      {
        product_id: products[0].id,
        quantity: 2,
        total_amount: 1999.98,
        customer_name: "John Doe",
        region: "North",
        sale_date: "2026-02-10 10:00:00", // February Data
      },
      {
        product_id: products[1].id,
        quantity: 5,
        total_amount: 129.95,
        customer_name: "Jane Smith",
        region: "South",
        sale_date: "2026-02-15 14:30:00", // February Data
      },
      {
        product_id: products[2].id,
        quantity: 3,
        total_amount: 225.0,
        customer_name: "Bob Johnson",
        region: "East",
        sale_date: "2026-02-20 09:15:00", // February Data
      },
      {
        product_id: products[0].id,
        quantity: 1,
        total_amount: 999.99,
        customer_name: "Alice Brown",
        region: "West",
        sale_date: "2026-03-01 12:00:00", // March Data
      },
      {
        product_id: products[3].id,
        quantity: 2,
        total_amount: 599.98,
        customer_name: "Charlie Wilson",
        region: "North",
        sale_date: "2026-02-25 16:45:00", // February Data
      },
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

seed();
