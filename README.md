# 🤖 SQL Agent — Natural Language Database Interface

An AI-powered SQL Agent built with Next.js that lets you query your database using plain English. No SQL knowledge required.

## ✨ Features

- **Natural Language to SQL** — Ask questions in plain English, the agent writes and runs the SQL itself
- **Tool Calling** — AI reasons step-by-step, selects the right tool, and chains multiple actions
- **Schema Awareness** — Agent automatically reads the database schema before generating queries
- **Real-Time Streaming** — Watch responses stream live as the AI thinks
- **Read-Only Safety** — Only `SELECT` queries allowed (no INSERT, UPDATE, DELETE, DROP)
- **Production Ready** — Deployed on Vercel with Turso as the cloud database

## 🧠 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | Frontend & API routes |
| AI SDK by Vercel | Streaming & tool calling |
| Groq (LLaMA 3.3 70B) | Ultra-fast AI inference |
| Drizzle ORM | Type-safe database queries |
| Turso (LibSQL) | Cloud SQLite database |
| Tailwind CSS | Styling |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com)
- A [Turso](https://turso.tech) account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/sql-agent.git
cd sql-agent
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token
```

4. **Run database migrations**
```bash
npm run db:generate
npm run db:migrate
```

5. **Seed the database (optional)**
```bash
npx tsx db/db.seed.ts
```

6. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure
```
sql-agent/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # AI agent API route
│   ├── page.tsx              # Main chat UI
│   └── layout.tsx
├── db/
│   ├── db.ts                 # Database client
│   ├── schema.ts             # Drizzle schema
│   └── db.seed.ts            # Seed data
├── drizzle.config.ts
└── .env.local
```

## 💬 Example Queries
```
"Show me all products in the Electronics category"
"Which customer spent the most in February?"
"List top 5 products by total sales"
"How many orders were placed last month?"
"Show sales by region"
```

## 📜 Database Schema

The project includes two tables:

- **products** — id, name, category, price, stock, created_at
- **sales** — id, product_id, quantity, total_amount, sale_date, customer_name, region

## 🔒 Security

- Only `SELECT` queries are allowed — the AI is instructed to never run destructive queries
- Environment variables are used for all sensitive credentials

## 📄 License

MIT License — feel free to use and modify.

---

Built with ❤️ using Next.js, Groq, and Turso
