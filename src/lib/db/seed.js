const { db } = require("@vercel/postgres");

// Run this script locally to set up the database
// TODO: find a less "manual" database management solution

async function seedStatuses(client) {
  try {
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS statuses (
      id SERIAL PRIMARY KEY,
      status VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `;

    console.log(`Created "statuses" table`);

    return {
      createTable,
    };
  } catch (error) {
    console.error("Error seeding statuses:", error);

    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedStatuses(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
