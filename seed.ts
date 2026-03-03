// ⚠️  SEED ALREADY EXECUTED — do not re-run without first clearing the DB.
// Data (wooden-house, glamping-tent) is live in Supabase.
// The accommodations array was removed from src/data/accommodations.ts (it's now types-only).
// To re-seed, add the accommodation data array directly here before running.
//
// Run with: node --env-file=.env --loader ts-node/esm seed.ts

import pg from 'pg';

const { Client } = pg;

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  console.error('Create a .env file with: DATABASE_URL=postgresql://postgres:PASSWORD@host:5432/postgres');
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database for seeding...');

    // TODO: Add accommodations array here if re-seeding is needed.
    // Example structure expected:
    // const accommodations = [{ id: 'wooden-house', name: '...', type: 'house', ... }]

    console.log('Database seeding complete!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.end();
  }
}

main();
