import { db, client } from "@/db/db";
import { groq } from "@ai-sdk/groq";
// import { google } from "@ai-sdk/google";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import z from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language.

${new Date().toLocaleString("sv-SE")}

Database Schema:
- products table: id, name, category, price, stock, created_at
- sales table: id, product_id, quantity, total_amount, sale_date, customer_name, region

Important column names:
- Revenue/amount column in sales is: total_amount (NOT sales_amount, NOT amount)
- Product name column is: name (NOT product_name)
- Stock column is: stock (NOT units_in_stock, NOT inventory)
- Categories available: Electronics, Furniture, Stationery

Common query examples:
- Total revenue: SELECT SUM(total_amount) FROM sales
- Revenue by region: SELECT region, SUM(total_amount) FROM sales GROUP BY region
- Products by category: SELECT * FROM products WHERE category = 'Electronics'
- Quantity sold for a product: SELECT SUM(s.quantity) FROM sales s JOIN products p ON s.product_id = p.id WHERE p.name = 'Laptop'
- Top customers: SELECT customer_name, SUM(total_amount) as total_spent FROM sales GROUP BY customer_name ORDER BY total_spent DESC LIMIT 3
- Low stock products: SELECT * FROM products WHERE stock < 50

You have access to following tools:
1. db tool - call this tool to query the database
2. schema tool - call this tool to get the database schema

Rules:
- Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
- ALWAYS call the db tool to execute queries. NEVER respond without querying first.
- Use EXACT column names from the schema above
- After getting results, ALWAYS explain in plain English. Never show raw data.
- Product names like 'Laptop', 'Mouse' are NAME values, not categories
Always respond in a helpful, conversational tone while being technically accurate.`;

  const result = streamText({
    model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(5),
    tools: {
      schema: tool({
        description: "Call this tool to get database schema information.",
        inputSchema: z.object({}),
        execute: async () => {
          return `CREATE TABLE products (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    price real NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    created_at text DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE sales (
    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    total_amount real NOT NULL,
    sale_date text DEFAULT CURRENT_TIMESTAMP,
    customer_name text NOT NULL,
    region text NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
)`;
        },
      }),
      db: tool({
        description: "Call this tool to query a database.",
        inputSchema: z.object({
          query: z.string().describe("The SQL query to be ran."),
        }),
        execute: async ({ query }) => {
          console.log("Query", query);
          const result = await client.execute(query);
          return JSON.stringify(result.rows);
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
