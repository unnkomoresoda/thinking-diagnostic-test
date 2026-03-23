import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, float } from "drizzle-orm/mysql-core";

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

export const diagnosticResults = mysqlTable("diagnostic_results", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Base Type code e.g. "ENTP" */
  baseType: varchar("baseType", { length: 8 }).notNull(),
  /** Cognitive Layer 1-5 */
  cognitiveLayer: int("cognitiveLayer").notNull(),
  /** Processing Power score 0-100 */
  processingPower: float("processingPower").notNull(),
  /** Dynamic Shift score 0-100 */
  dynamicShift: float("dynamicShift").notNull(),
  /** 80-type name e.g. "戦略的アーキテクト" */
  typeName: varchar("typeName", { length: 128 }).notNull(),
  /** Full type code e.g. "ENTP-S3" */
  typeCode: varchar("typeCode", { length: 16 }).notNull(),
  /** Raw dimension scores for radar chart */
  dimensionScores: json("dimensionScores"),
  /** Raw answers JSON */
  rawAnswers: json("rawAnswers"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DiagnosticResult = typeof diagnosticResults.$inferSelect;
export type InsertDiagnosticResult = typeof diagnosticResults.$inferInsert;

// ============================================================
// Question Patterns (Pre-generated patterns for variety)
// ============================================================
export const questionPatterns = mysqlTable("question_patterns", {
  id: int("id").autoincrement().primaryKey(),
  /** Pattern type: "layer", "power", or "shift" */
  patternType: mysqlEnum("patternType", ["layer", "power", "shift"]).notNull(),
  /** Pattern index 0-3 (4 patterns per type) */
  patternIndex: int("patternIndex").notNull(),
  /** Questions array JSON */
  questions: json("questions").notNull(),
  /** Creation timestamp */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** Update timestamp */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuestionPattern = typeof questionPatterns.$inferSelect;
export type InsertQuestionPattern = typeof questionPatterns.$inferInsert;
