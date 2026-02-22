import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL, {
  fetchConnectionCache: true, // ← keeps connection warm between requests
});

export default sql;