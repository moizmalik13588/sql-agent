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

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language.
${new Date().toLocaleString("sv-SE")}

Here is the database schema:
CREATE TABLE products (
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
  FOREIGN KEY (product_id) REFERENCES products(id)
)

Rules:
- Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
- ALWAYS call the db tool to execute the query. NEVER respond with just text without calling db tool first.
- Pass valid SQL syntax to db tool.
- After getting results from db tool, summarize the data in a helpful way.
Always respond in a helpful, conversational tone while being technically accurate.`;

  const result = streamText({
    model: groq("llama3-groq-70b-8192-tool-use-preview"),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(10),
    tools: {
      db: tool({
        description: "Call this tool to execute a SQL query on the database.",
        inputSchema: z.object({
          query: z.string().describe("The SQL SELECT query to be executed."),
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
