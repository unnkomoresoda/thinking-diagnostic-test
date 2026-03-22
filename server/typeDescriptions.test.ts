import { describe, expect, it } from "vitest";
import {
  TYPE_DESCRIPTIONS,
  getTypeDescription,
  getTypesByBaseType,
  getTypesByLayer,
  type TypeDescription,
} from "../shared/typeDescriptions";
import {
  BASE_TYPES,
  LAYER_LABELS,
  TYPE_NAME_MATRIX,
  type BaseType,
} from "../shared/diagnosticData";

// ============================================================
// TYPE_DESCRIPTIONS data integrity
// ============================================================
describe("TYPE_DESCRIPTIONS data integrity", () => {
  it("has exactly 80 type descriptions", () => {
    expect(TYPE_DESCRIPTIONS).toHaveLength(80);
  });

  it("covers all 16 base types × 5 layers", () => {
    const codes = new Set(TYPE_DESCRIPTIONS.map((t) => t.code));
    expect(codes.size).toBe(80);
    for (const bt of BASE_TYPES) {
      for (let layer = 1; layer <= 5; layer++) {
        const code = `${bt}-L${layer}`;
        expect(codes.has(code)).toBe(true);
      }
    }
  });

  it("has no duplicate codes", () => {
    const codes = TYPE_DESCRIPTIONS.map((t) => t.code);
    const unique = new Set(codes);
    expect(unique.size).toBe(codes.length);
  });

  it("each type has all required fields", () => {
    for (const type of TYPE_DESCRIPTIONS) {
      expect(type.code).toBeTruthy();
      expect(type.summary).toBeTruthy();
      expect(type.description).toBeTruthy();
      expect(type.strengths.length).toBeGreaterThanOrEqual(2);
      expect(type.weaknesses.length).toBeGreaterThanOrEqual(2);
      expect(type.careers.length).toBeGreaterThanOrEqual(2);
      expect(type.famousPeople.length).toBeGreaterThanOrEqual(1);
      expect(type.growthAdvice).toBeTruthy();
      expect(type.stressResponse).toBeTruthy();
      expect(type.communicationStyle).toBeTruthy();
    }
  });

  it("each type code follows the format XXXX-LN", () => {
    const codePattern = /^[A-Z]{4}-L[1-5]$/;
    for (const type of TYPE_DESCRIPTIONS) {
      expect(type.code).toMatch(codePattern);
    }
  });

  it("compatible types reference valid codes", () => {
    const allCodes = new Set(TYPE_DESCRIPTIONS.map((t) => t.code));
    for (const type of TYPE_DESCRIPTIONS) {
      for (const ct of type.compatibleTypes) {
        expect(allCodes.has(ct)).toBe(true);
      }
    }
  });
});

// ============================================================
// getTypeDescription
// ============================================================
describe("getTypeDescription", () => {
  it("returns the correct type for INTJ-L1", () => {
    const result = getTypeDescription("INTJ-L1");
    expect(result).toBeDefined();
    expect(result!.code).toBe("INTJ-L1");
    expect(result!.summary).toBeTruthy();
  });

  it("returns the correct type for ESFP-L5", () => {
    const result = getTypeDescription("ESFP-L5");
    expect(result).toBeDefined();
    expect(result!.code).toBe("ESFP-L5");
  });

  it("returns undefined for non-existent code", () => {
    const result = getTypeDescription("XXXX-L1");
    expect(result).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    const result = getTypeDescription("");
    expect(result).toBeUndefined();
  });
});

// ============================================================
// getTypesByBaseType
// ============================================================
describe("getTypesByBaseType", () => {
  it("returns 5 types for INTJ", () => {
    const result = getTypesByBaseType("INTJ");
    expect(result).toHaveLength(5);
    result.forEach((t) => {
      expect(t.code).toMatch(/^INTJ-L[1-5]$/);
    });
  });

  it("returns 5 types for each base type", () => {
    for (const bt of BASE_TYPES) {
      const result = getTypesByBaseType(bt);
      expect(result).toHaveLength(5);
    }
  });

  it("returns empty array for invalid base type", () => {
    const result = getTypesByBaseType("XXXX");
    expect(result).toHaveLength(0);
  });
});

// ============================================================
// getTypesByLayer
// ============================================================
describe("getTypesByLayer", () => {
  it("returns 16 types for layer 1", () => {
    const result = getTypesByLayer(1);
    expect(result).toHaveLength(16);
    result.forEach((t) => {
      expect(t.code).toMatch(/-L1$/);
    });
  });

  it("returns 16 types for each layer", () => {
    for (let layer = 1; layer <= 5; layer++) {
      const result = getTypesByLayer(layer);
      expect(result).toHaveLength(16);
    }
  });

  it("returns empty array for invalid layer", () => {
    const result = getTypesByLayer(0);
    expect(result).toHaveLength(0);
    const result2 = getTypesByLayer(6);
    expect(result2).toHaveLength(0);
  });
});

// ============================================================
// Cross-reference with diagnosticData
// ============================================================
describe("cross-reference with diagnosticData", () => {
  it("TYPE_DESCRIPTIONS codes match TYPE_NAME_MATRIX entries", () => {
    for (const bt of BASE_TYPES) {
      const names = TYPE_NAME_MATRIX[bt];
      for (let i = 0; i < 5; i++) {
        const code = `${bt}-L${i + 1}`;
        const desc = getTypeDescription(code);
        expect(desc).toBeDefined();
      }
    }
  });
});
