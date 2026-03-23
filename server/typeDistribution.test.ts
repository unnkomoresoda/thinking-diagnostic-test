import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { getTypeDistribution } from "./db";
import { users, diagnosticResults } from "../drizzle/schema";

describe("Type Distribution Statistics", { timeout: 30000 }, () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }
  });

  it("should return type distribution sorted by count descending", async () => {
    const distribution = await getTypeDistribution();

    // Check if result is an array
    expect(Array.isArray(distribution)).toBe(true);

    // If there's data, verify structure
    if (distribution.length > 0) {
      const firstItem = distribution[0];
      expect(firstItem).toHaveProperty("typeCode");
      expect(firstItem).toHaveProperty("typeName");
      expect(firstItem).toHaveProperty("count");
      expect(typeof firstItem.typeCode).toBe("string");
      expect(typeof firstItem.typeName).toBe("string");
      expect(typeof firstItem.count).toBe("number");
    }
  });

  it("should have count in descending order", async () => {
    const distribution = await getTypeDistribution();

    // Check if counts are in descending order
    for (let i = 0; i < distribution.length - 1; i++) {
      expect(distribution[i].count).toBeGreaterThanOrEqual(distribution[i + 1].count);
    }
  });

  it("should not have duplicate type codes", async () => {
    const distribution = await getTypeDistribution();
    const typeCodes = distribution.map((d) => d.typeCode);
    const uniqueTypeCodes = new Set(typeCodes);

    expect(uniqueTypeCodes.size).toBe(typeCodes.length);
  });

  it("should have positive counts", async () => {
    const distribution = await getTypeDistribution();

    for (const item of distribution) {
      expect(item.count).toBeGreaterThan(0);
    }
  });
});
