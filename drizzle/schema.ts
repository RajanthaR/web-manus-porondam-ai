import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Horoscope chart data extracted from images
 */
export const horoscopeCharts = mysqlTable("horoscope_charts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  
  // Person info
  personName: varchar("personName", { length: 255 }),
  gender: mysqlEnum("gender", ["male", "female"]),
  
  // Birth details
  birthDate: timestamp("birthDate"),
  birthTime: varchar("birthTime", { length: 20 }), // HH:MM format
  birthPlace: varchar("birthPlace", { length: 255 }),
  
  // Calculated astrological data
  nakshatra: int("nakshatra"), // 1-27
  nakshatraPada: int("nakshatraPada"), // 1-4
  rashi: int("rashi"), // 1-12 zodiac sign
  
  // Planetary positions (JSON object with planet positions)
  planetaryPositions: json("planetaryPositions"),
  
  // Original image
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 512 }),
  
  // Raw extracted text from image
  extractedText: text("extractedText"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HoroscopeChart = typeof horoscopeCharts.$inferSelect;
export type InsertHoroscopeChart = typeof horoscopeCharts.$inferInsert;

/**
 * Matching results between two horoscope charts
 */
export const matchingResults = mysqlTable("matching_results", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  
  // References to the two charts being matched
  chart1Id: int("chart1Id").references(() => horoscopeCharts.id),
  chart2Id: int("chart2Id").references(() => horoscopeCharts.id),
  
  // Overall compatibility score (0-100)
  overallScore: decimal("overallScore", { precision: 5, scale: 2 }),
  
  // Individual Porondam scores (JSON with all 20 aspects)
  porondamScores: json("porondamScores"),
  
  // Detailed analysis and recommendations
  analysis: text("analysis"),
  recommendations: text("recommendations"),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MatchingResult = typeof matchingResults.$inferSelect;
export type InsertMatchingResult = typeof matchingResults.$inferInsert;

/**
 * Type definitions for JSON fields
 */
export interface PlanetaryPositions {
  sun?: { sign: number; degree: number; house: number };
  moon?: { sign: number; degree: number; house: number };
  mars?: { sign: number; degree: number; house: number };
  mercury?: { sign: number; degree: number; house: number };
  jupiter?: { sign: number; degree: number; house: number };
  venus?: { sign: number; degree: number; house: number };
  saturn?: { sign: number; degree: number; house: number };
  rahu?: { sign: number; degree: number; house: number };
  ketu?: { sign: number; degree: number; house: number };
  lagna?: { sign: number; degree: number };
}

export interface PorondamScore {
  name: string;
  nameSinhala: string;
  maxPoints: number;
  score: number;
  matched: boolean;
  description: string;
  descriptionSinhala: string;
}

export interface PorondamScores {
  nakath: PorondamScore;
  gana: PorondamScore;
  mahendra: PorondamScore;
  streeDeerga: PorondamScore;
  yoni: PorondamScore;
  rashi: PorondamScore;
  rashiAdhipathi: PorondamScore;
  vashya: PorondamScore;
  rajju: PorondamScore;
  vedha: PorondamScore;
  linga: PorondamScore;
  gotra: PorondamScore;
  varna: PorondamScore;
  vruksha: PorondamScore;
  ayusha: PorondamScore;
  pakshi: PorondamScore;
  panchaMahaBhutha: PorondamScore;
  dina: PorondamScore;
  nadi: PorondamScore;
  graha: PorondamScore;
}
