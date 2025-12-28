import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  horoscopeCharts, InsertHoroscopeChart, HoroscopeChart,
  matchingResults, InsertMatchingResult, MatchingResult
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER OPERATIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ HOROSCOPE CHART OPERATIONS ============

export async function createHoroscopeChart(chart: InsertHoroscopeChart): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(horoscopeCharts).values(chart);
  return result[0].insertId;
}

export async function getHoroscopeChartById(id: number): Promise<HoroscopeChart | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(horoscopeCharts).where(eq(horoscopeCharts.id, id)).limit(1);
  return result[0];
}

export async function getHoroscopeChartsByUserId(userId: number): Promise<HoroscopeChart[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(horoscopeCharts)
    .where(eq(horoscopeCharts.userId, userId))
    .orderBy(desc(horoscopeCharts.createdAt));
}

export async function updateHoroscopeChart(id: number, updates: Partial<InsertHoroscopeChart>): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(horoscopeCharts).set(updates).where(eq(horoscopeCharts.id, id));
}

export async function deleteHoroscopeChart(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(horoscopeCharts).where(eq(horoscopeCharts.id, id));
}

// ============ MATCHING RESULTS OPERATIONS ============

export async function createMatchingResult(result: InsertMatchingResult): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const insertResult = await db.insert(matchingResults).values(result);
  return insertResult[0].insertId;
}

export async function getMatchingResultById(id: number): Promise<MatchingResult | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(matchingResults).where(eq(matchingResults.id, id)).limit(1);
  return result[0];
}

export async function getMatchingResultsByUserId(userId: number): Promise<MatchingResult[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select()
    .from(matchingResults)
    .where(eq(matchingResults.userId, userId))
    .orderBy(desc(matchingResults.createdAt));
}

export async function getMatchingResultWithCharts(id: number): Promise<{
  result: MatchingResult;
  chart1: HoroscopeChart | undefined;
  chart2: HoroscopeChart | undefined;
} | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await getMatchingResultById(id);
  if (!result) return undefined;

  const chart1 = result.chart1Id ? await getHoroscopeChartById(result.chart1Id) : undefined;
  const chart2 = result.chart2Id ? await getHoroscopeChartById(result.chart2Id) : undefined;

  return { result, chart1, chart2 };
}

export async function deleteMatchingResult(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(matchingResults).where(eq(matchingResults.id, id));
}

// ============ COMBINED OPERATIONS ============

export async function getRecentMatchesForUser(userId: number, limit: number = 10): Promise<Array<{
  match: MatchingResult;
  chart1Name: string | null;
  chart2Name: string | null;
}>> {
  const db = await getDb();
  if (!db) return [];

  const matches = await db.select()
    .from(matchingResults)
    .where(eq(matchingResults.userId, userId))
    .orderBy(desc(matchingResults.createdAt))
    .limit(limit);

  const results = [];
  for (const match of matches) {
    const chart1 = match.chart1Id ? await getHoroscopeChartById(match.chart1Id) : undefined;
    const chart2 = match.chart2Id ? await getHoroscopeChartById(match.chart2Id) : undefined;
    
    results.push({
      match,
      chart1Name: chart1?.personName ?? null,
      chart2Name: chart2?.personName ?? null,
    });
  }

  return results;
}
