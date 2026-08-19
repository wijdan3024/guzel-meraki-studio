import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// ---- Prisma Client Singleton (Prisma 7) ----
// As of Prisma ORM v7, the built-in connection engine was removed —
// PrismaClient must be given an explicit "adapter" that knows how to talk
// to the database (here, a plain PostgreSQL connection pool). The
// prisma.config.ts file is only read by the Prisma CLI (for `db push`,
// `generate`, etc.) — it is NOT automatically used by PrismaClient at
// runtime, so the connection string has to be wired up here too.
//
// The singleton pattern (storing on `globalThis`) still applies: it stops
// Next.js's dev-mode hot-reloading from creating a new connection pool on
// every file save.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const pool =
  globalForPrisma.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}