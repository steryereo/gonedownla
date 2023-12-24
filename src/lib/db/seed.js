const { db } = require("@vercel/postgres");

async function seed() {
  const createTable = await sql`
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
}

module.exports = { seed };
