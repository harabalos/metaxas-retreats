import fs from 'fs';
import pg from 'pg';

const { Client } = pg;

if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set.');
    console.error('Run with: node --env-file=.env migrate.js');
    process.exit(1);
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    try {
        const sql = fs.readFileSync('supabase/migrations/20260303000000_init.sql', 'utf8');
        await client.connect();
        console.log('Connected to Supabase PostgreSQL database...');

        await client.query(sql);
        console.log('Successfully created accommodations and accommodation_prices tables and RLS policies.');

    } catch (err) {
        console.error('Error applying migration:', err.stack);
    } finally {
        await client.end();
    }
}

main();
