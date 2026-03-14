import { db } from "@/db/db";
import { groq } from "@ai-sdk/groq";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import z from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const DB_SCHEMA = [
    "CREATE TABLE products (",
    "  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,",
    "  name text NOT NULL,",
    "  category text NOT NULL,",
    "  price real NOT NULL,",
    "  stock integer DEFAULT 0 NOT NULL,",
    "  created_at text DEFAULT CURRENT_TIMESTAMP",
    ")",
    "CREATE TABLE sales (",
    "  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,",
    "  product_id integer NOT NULL,",
    "  quantity integer NOT NULL,",
    "  total_amount real NOT NULL,",
    "  sale_date text DEFAULT CURRENT_TIMESTAMP,",
    "  customer_name text NOT NULL,",
    "  region text NOT NULL,",
    "  FOREIGN KEY (product_id) REFERENCES products(id)",
    ")",
  ].join("\n");

  const SYSTEM_PROMPT =
    "You are an expert SQL assistant that helps users to query their database using natural language.\n" +
    new Date().toLocaleString("sv-SE") +
    "\n\n" +
    "Here is the database schema:\n" +
    DB_SCHEMA +
    "\n\n" +
    "Rules:\n" +
    "- Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)\n" +
    "- ALWAYS call the db tool to execute the query. NEVER respond without calling db tool first.\n" +
    "- Pass valid SQL syntax to db tool.\n" +
    "- After getting results from db tool, ALWAYS explain the results in plain English. Never just show raw data.\n" +
    "Always respond in a helpful, conversational tone while being technically accurate.";

  const result = streamText({
    model: groq("llama3-groq-70b-8192-tool-use-preview"),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(10),
    tools: {
      db: tool({
        description: "Call this tool to query a database.",
        inputSchema: z.object({
          query: z.string().describe("The SQL query to be ran."),
        }),
        execute: async ({ query }) => {
          console.log("Query", query);
          return await db.run(query);
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
