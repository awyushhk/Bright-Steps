import sql from './db';

export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS children (
      id TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL,
      name TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      gender TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS screenings (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      parent_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      submitted_at TEXT,
      questionnaire_responses JSONB,
      questionnaire_score INTEGER DEFAULT 0,
      videos JSONB DEFAULT '[]',
      risk_assessment JSONB,
      clinician_review JSONB
    )
  `;
}