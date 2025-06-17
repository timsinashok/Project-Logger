import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Supabase recommends this for connection pooling in serverless environments
const client = postgres(process.env.DATABASE_URL, { 
  prepare: false,
  max: 1, // Limit connections for serverless
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });