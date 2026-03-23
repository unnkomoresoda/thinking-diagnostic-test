import { eq, desc, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, diagnosticResults, InsertDiagnosticResult, questionPatterns, InsertQuestionPattern } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

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

// ---- Diagnostic Results ----

export async function saveDiagnosticResult(data: InsertDiagnosticResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(diagnosticResults).values(data);
  return result[0].insertId;
}

export async function getDiagnosticResultsByUser(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(diagnosticResults)
    .where(eq(diagnosticResults.userId, userId))
    .orderBy(desc(diagnosticResults.createdAt))
    .limit(limit);
}

export async function getDiagnosticResultById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db
    .select()
    .from(diagnosticResults)
    .where(eq(diagnosticResults.id, id))
    .limit(1);

  return rows[0] ?? null;
}

// ---- Admin: All diagnostic results with user info ----

export async function getAllDiagnosticResults(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select({
      id: diagnosticResults.id,
      userId: diagnosticResults.userId,
      userName: users.name,
      userEmail: users.email,
      baseType: diagnosticResults.baseType,
      cognitiveLayer: diagnosticResults.cognitiveLayer,
      processingPower: diagnosticResults.processingPower,
      dynamicShift: diagnosticResults.dynamicShift,
      typeName: diagnosticResults.typeName,
      typeCode: diagnosticResults.typeCode,
      dimensionScores: diagnosticResults.dimensionScores,
      createdAt: diagnosticResults.createdAt,
    })
    .from(diagnosticResults)
    .innerJoin(users, eq(diagnosticResults.userId, users.id))
    .orderBy(desc(diagnosticResults.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getDiagnosticStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Total count
  const totalRows = await db
    .select({ count: count() })
    .from(diagnosticResults);
  const totalCount = totalRows[0]?.count ?? 0;

  // Unique users
  const uniqueUserRows = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${diagnosticResults.userId})` })
    .from(diagnosticResults);
  const uniqueUsers = uniqueUserRows[0]?.count ?? 0;

  // Base type distribution
  const baseTypeDist = await db
    .select({
      baseType: diagnosticResults.baseType,
      count: count(),
    })
    .from(diagnosticResults)
    .groupBy(diagnosticResults.baseType)
    .orderBy(desc(count()));

  // Type code distribution (top 20)
  const typeCodeDist = await db
    .select({
      typeCode: diagnosticResults.typeCode,
      typeName: diagnosticResults.typeName,
      count: count(),
    })
    .from(diagnosticResults)
    .groupBy(diagnosticResults.typeCode, diagnosticResults.typeName)
    .orderBy(desc(count()))
    .limit(20);

  // Layer distribution
  const layerDist = await db
    .select({
      layer: diagnosticResults.cognitiveLayer,
      count: count(),
    })
    .from(diagnosticResults)
    .groupBy(diagnosticResults.cognitiveLayer)
    .orderBy(diagnosticResults.cognitiveLayer);

  return {
    totalCount,
    uniqueUsers,
    baseTypeDist,
    typeCodeDist,
    layerDist,
  };
}

export async function getMonthlyStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Monthly count and type distribution
  const monthlyData = await db
    .select({
      month: sql<string>`DATE_FORMAT(${diagnosticResults.createdAt}, '%Y-%m')`,
      count: count(),
      baseType: diagnosticResults.baseType,
      typeCode: diagnosticResults.typeCode,
      typeName: diagnosticResults.typeName,
    })
    .from(diagnosticResults)
    .groupBy(
      sql`DATE_FORMAT(${diagnosticResults.createdAt}, '%Y-%m')`,
      diagnosticResults.baseType,
      diagnosticResults.typeCode,
      diagnosticResults.typeName
    )
    .orderBy(sql`DATE_FORMAT(${diagnosticResults.createdAt}, '%Y-%m') DESC`);

  // Group by month
  const monthlyStats: Record<string, { total: number; types: Record<string, number> }> = {};
  for (const row of monthlyData) {
    const month = row.month || 'Unknown';
    if (!monthlyStats[month]) {
      monthlyStats[month] = { total: 0, types: {} };
    }
    monthlyStats[month].total += row.count;
    monthlyStats[month].types[row.typeCode || 'Unknown'] = row.count;
  }

  return monthlyStats;
}

// ---- Type Distribution Statistics ----

export async function getTypeDistribution() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get all 80 types with their diagnostic counts, sorted by count (descending)
  const typeDistribution = await db
    .select({
      typeCode: diagnosticResults.typeCode,
      typeName: diagnosticResults.typeName,
      count: count(),
    })
    .from(diagnosticResults)
    .groupBy(diagnosticResults.typeCode, diagnosticResults.typeName)
    .orderBy(desc(count()));

  return typeDistribution;
}

// ---- Question Patterns (Pre-generated) ----

export async function saveQuestionPattern(data: InsertQuestionPattern) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete existing pattern if it exists
  await db
    .delete(questionPatterns)
    .where(
      sql`${questionPatterns.patternType} = ${data.patternType} AND ${questionPatterns.patternIndex} = ${data.patternIndex}`
    );

  // Insert new pattern
  const result = await db.insert(questionPatterns).values(data);
  return result[0].insertId;
}

export async function getQuestionPattern(patternType: "layer" | "power" | "shift", patternIndex: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const rows = await db
    .select()
    .from(questionPatterns)
    .where(
      sql`${questionPatterns.patternType} = ${patternType} AND ${questionPatterns.patternIndex} = ${patternIndex}`
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function getAllQuestionPatterns(patternType: "layer" | "power" | "shift") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(questionPatterns)
    .where(eq(questionPatterns.patternType, patternType))
    .orderBy(questionPatterns.patternIndex);
}

export async function deleteAllQuestionPatterns() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(questionPatterns);
}
