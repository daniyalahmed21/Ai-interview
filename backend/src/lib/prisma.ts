import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const connectionString: string = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({
  url: connectionString.replace("file:", ""),
});
export const prisma = new PrismaClient({ adapter });
