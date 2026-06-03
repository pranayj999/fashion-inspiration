import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { AiMetadata, DesignerAnnotations, ImageRecord } from "./types";

const defaultDataDir = path.join(process.cwd(), "data");

function getDbPath() {
  return process.env.INSPIRATION_DB_PATH ?? path.join(defaultDataDir, "inspiration.db");
}

function ensureDataDir() {
  const dbPath = getDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

let db: Database.Database | null = null;

export function resetDbConnection() {
  if (db) {
    db.close();
    db = null;
  }
}

export function getDb() {
  if (!db) {
    ensureDataDir();
    db = new Database(getDbPath());
    db.pragma("journal_mode = WAL");
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      designer TEXT NOT NULL DEFAULT 'Unknown',
      captured_at TEXT NOT NULL,
      description TEXT NOT NULL,
      garment_type TEXT NOT NULL,
      style TEXT NOT NULL,
      material TEXT NOT NULL,
      color_palette TEXT NOT NULL,
      pattern TEXT NOT NULL,
      season TEXT NOT NULL,
      occasion TEXT NOT NULL,
      consumer_profile TEXT NOT NULL,
      trend_notes TEXT NOT NULL,
      continent TEXT NOT NULL,
      country TEXT NOT NULL,
      city TEXT NOT NULL,
      annotation_tags TEXT NOT NULL DEFAULT '[]',
      annotation_notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_images_garment_type ON images(garment_type);
    CREATE INDEX IF NOT EXISTS idx_images_designer ON images(designer);
    CREATE INDEX IF NOT EXISTS idx_images_captured_at ON images(captured_at);
  `);
}

function rowToRecord(row: Record<string, unknown>): ImageRecord {
  return {
    id: row.id as string,
    filename: row.filename as string,
    designer: row.designer as string,
    capturedAt: row.captured_at as string,
    ai: {
      description: row.description as string,
      garmentType: row.garment_type as string,
      style: row.style as string,
      material: row.material as string,
      colorPalette: JSON.parse(row.color_palette as string),
      pattern: row.pattern as string,
      season: row.season as string,
      occasion: row.occasion as string,
      consumerProfile: row.consumer_profile as string,
      trendNotes: row.trend_notes as string,
      location: {
        continent: row.continent as string,
        country: row.country as string,
        city: row.city as string,
      },
    },
    annotations: {
      tags: JSON.parse(row.annotation_tags as string),
      notes: row.annotation_notes as string,
    },
    createdAt: row.created_at as string,
  };
}

export function insertImage(record: ImageRecord) {
  const database = getDb();
  database
    .prepare(
      `INSERT INTO images (
        id, filename, designer, captured_at, description,
        garment_type, style, material, color_palette, pattern,
        season, occasion, consumer_profile, trend_notes,
        continent, country, city, annotation_tags, annotation_notes, created_at
      ) VALUES (
        @id, @filename, @designer, @capturedAt, @description,
        @garmentType, @style, @material, @colorPalette, @pattern,
        @season, @occasion, @consumerProfile, @trendNotes,
        @continent, @country, @city, @annotationTags, @annotationNotes, @createdAt
      )`
    )
    .run({
      id: record.id,
      filename: record.filename,
      designer: record.designer,
      capturedAt: record.capturedAt,
      description: record.ai.description,
      garmentType: record.ai.garmentType,
      style: record.ai.style,
      material: record.ai.material,
      colorPalette: JSON.stringify(record.ai.colorPalette),
      pattern: record.ai.pattern,
      season: record.ai.season,
      occasion: record.ai.occasion,
      consumerProfile: record.ai.consumerProfile,
      trendNotes: record.ai.trendNotes,
      continent: record.ai.location.continent,
      country: record.ai.location.country,
      city: record.ai.location.city,
      annotationTags: JSON.stringify(record.annotations.tags),
      annotationNotes: record.annotations.notes,
      createdAt: record.createdAt,
    });
}

export function listImages(): ImageRecord[] {
  const database = getDb();
  const rows = database
    .prepare("SELECT * FROM images ORDER BY created_at DESC")
    .all();
  return rows.map((row) => rowToRecord(row as Record<string, unknown>));
}

export function getImageById(id: string): ImageRecord | null {
  const database = getDb();
  const row = database.prepare("SELECT * FROM images WHERE id = ?").get(id);
  if (!row) return null;
  return rowToRecord(row as Record<string, unknown>);
}

export function updateAnnotations(
  id: string,
  annotations: DesignerAnnotations
): ImageRecord | null {
  const existing = getImageById(id);
  if (!existing) return null;

  const database = getDb();
  database
    .prepare(
      `UPDATE images SET annotation_tags = ?, annotation_notes = ? WHERE id = ?`
    )
    .run(JSON.stringify(annotations.tags), annotations.notes, id);

  return getImageById(id);
}

export function insertImageFromParts(
  id: string,
  filename: string,
  designer: string,
  capturedAt: string,
  ai: AiMetadata,
  annotations: DesignerAnnotations = { tags: [], notes: "" }
) {
  insertImage({
    id,
    filename,
    designer,
    capturedAt,
    ai,
    annotations,
    createdAt: new Date().toISOString(),
  });
}
