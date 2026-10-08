import { seedDatabase } from "../lib/seed";

const reset = process.argv.includes("--reset");

seedDatabase(reset)
  .then((counts) => {
    console.log(reset ? "Replaced sample data." : "Upserted sample data.", counts);
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Seed failed.");
    process.exit(1);
  });
