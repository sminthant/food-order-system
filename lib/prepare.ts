import { connection } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { seedIfEmpty } from "@/lib/seed";

export async function prepareRequest() {
  await connection();
  await connectDB();
  await seedIfEmpty();
}
