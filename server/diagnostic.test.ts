import { describe, expect, it } from "vitest";
import {
  calculateBaseType,
  calculateLayer,
  calculatePower,
  calculateShift,
  getTypeName,
  getTypeCode,
  BASE_TYPE_QUESTIONS,
  LAYER_QUESTIONS,
  POWER_QUESTIONS,
  SHIFT_SCENARIOS,
  LAYER_LABELS,
  TYPE_NAME_MATRIX,
  BASE_TYPES,
} from "../shared/diagnosticData";

// ============================================================
// calculateBaseType
// ============================================================
describe("calculateBaseType", () => {
  it("returns ESTJ when all answers are A", () => {
    // All A: E(5) > I(0), S(5) > N(0), T(5) > F(0), J(5) > P(0)
    const answers: Record<string, string> = {};
    for (const q of BASE_TYPE_QUESTIONS) {
      answers[q.id] = "A";
    }
    const result = calculateBaseType(answers);
    expect(result.type).toBe("ESTJ");
    expect(result.scores.EI.first).toBe(5);
    expect(result.scores.EI.second).toBe(0);
    expect(result.scores.SN.first).toBe(5);
    expect(result.scores.TF.first).toBe(5);
    expect(result.scores.JP.first).toBe(5);
  });

  it("returns INFP when all answers are B", () => {
    // All B: I(5) > E(0), N(5) > S(0), F(5) > T(0), P(5) > J(0)
    const answers: Record<string, string> = {};
    for (const q of BASE_TYPE_QUESTIONS) {
      answers[q.id] = "B";
    }
    const result = calculateBaseType(answers);
    expect(result.type).toBe("INFP");
    expect(result.scores.EI.second).toBe(5);
    expect(result.scores.SN.second).toBe(5);
    expect(result.scores.TF.second).toBe(5);
    expect(result.scores.JP.second).toBe(5);
  });

  it("handles empty answers gracefully", () => {
    const result = calculateBaseType({});
    // All zeros → first >= second (0 >= 0) → ESTJ
    expect(BASE_TYPES).toContain(result.type);
  });

  it("returns a valid MBTI type", () => {
    const answers: Record<string, string> = {};
    // Mix of A and B
    BASE_TYPE_QUESTIONS.forEach((q, i) => {
      answers[q.id] = i % 2 === 0 ? "A" : "B";
    });
    const result = calculateBaseType(answers);
    expect(BASE_TYPES).toContain(result.type);
    expect(result.type).toHaveLength(4);
  });
});

// ============================================================
// calculateLayer
// ============================================================
describe("calculateLayer", () => {
  it("returns layer 1 when all answers are 1", () => {
    const answers: Record<string, number> = {};
    for (const q of LAYER_QUESTIONS) {
      answers[q.id] = 1;
    }
    const result = calculateLayer(answers);
    expect(result.layer).toBe(1);
    expect(result.distribution[0]).toBe(10);
    expect(result.distribution[1]).toBe(0);
  });

  it("returns layer 5 when all answers are 5", () => {
    const answers: Record<string, number> = {};
    for (const q of LAYER_QUESTIONS) {
      answers[q.id] = 5;
    }
    const result = calculateLayer(answers);
    expect(result.layer).toBe(5);
    expect(result.distribution[4]).toBe(10);
  });

  it("returns the layer with the highest count", () => {
    const answers: Record<string, number> = {};
    // 6 answers for layer 3, 4 for layer 2
    LAYER_QUESTIONS.forEach((q, i) => {
      answers[q.id] = i < 6 ? 3 : 2;
    });
    const result = calculateLayer(answers);
    expect(result.layer).toBe(3);
    expect(result.distribution[2]).toBe(6);
    expect(result.distribution[1]).toBe(4);
  });

  it("distribution sums to total number of answers", () => {
    const answers: Record<string, number> = {};
    LAYER_QUESTIONS.forEach((q, i) => {
      answers[q.id] = (i % 5) + 1;
    });
    const result = calculateLayer(answers);
    const sum = result.distribution.reduce((a, b) => a + b, 0);
    expect(sum).toBe(LAYER_QUESTIONS.length);
  });
});

// ============================================================
// calculatePower
// ============================================================
describe("calculatePower", () => {
  it("returns 100 when all answers are correct", () => {
    const answers: Record<string, number> = {};
    for (const q of POWER_QUESTIONS) {
      const correctIdx = q.options.findIndex((o) => o.correct);
      answers[q.id] = correctIdx;
    }
    const result = calculatePower(answers);
    expect(result.score).toBe(100);
    expect(result.details.correct).toBe(POWER_QUESTIONS.length);
    expect(result.details.total).toBe(POWER_QUESTIONS.length);
  });

  it("returns 0 when all answers are wrong", () => {
    const answers: Record<string, number> = {};
    for (const q of POWER_QUESTIONS) {
      const wrongIdx = q.options.findIndex((o) => !o.correct);
      answers[q.id] = wrongIdx;
    }
    const result = calculatePower(answers);
    expect(result.score).toBe(0);
    expect(result.details.correct).toBe(0);
  });

  it("returns 0 for empty answers", () => {
    const result = calculatePower({});
    expect(result.score).toBe(0);
    expect(result.details.correct).toBe(0);
    expect(result.details.total).toBe(POWER_QUESTIONS.length);
  });

  it("score is between 0 and 100", () => {
    const answers: Record<string, number> = {};
    POWER_QUESTIONS.forEach((q, i) => {
      answers[q.id] = i % 4; // random-ish answers
    });
    const result = calculatePower(answers);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});

// ============================================================
// calculateShift
// ============================================================
describe("calculateShift", () => {
  it("returns a score between 0 and 100", () => {
    const answers: Record<string, number[]> = {};
    for (const s of SHIFT_SCENARIOS) {
      answers[s.id] = s.phases.map(() => 0);
    }
    const result = calculateShift(answers);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("returns 0 for empty answers", () => {
    const result = calculateShift({});
    expect(result.score).toBe(0);
    expect(result.adaptability).toBe(0);
  });

  it("adaptability is between 0 and 100", () => {
    const answers: Record<string, number[]> = {};
    for (const s of SHIFT_SCENARIOS) {
      answers[s.id] = s.phases.map((_, i) => i % s.phases[0].options.length);
    }
    const result = calculateShift(answers);
    expect(result.adaptability).toBeGreaterThanOrEqual(0);
    expect(result.adaptability).toBeLessThanOrEqual(100);
  });
});

// ============================================================
// getTypeName & getTypeCode
// ============================================================
describe("getTypeName", () => {
  it("returns correct type name for ENTP layer 3", () => {
    const name = getTypeName("ENTP", 3);
    expect(name).toBe("戦略的アーキテクト");
  });

  it("returns correct type name for INTJ layer 1", () => {
    const name = getTypeName("INTJ", 1);
    expect(name).toBe("精密な実行者");
  });

  it("returns correct type name for INTJ layer 5", () => {
    const name = getTypeName("INTJ", 5);
    expect(name).toBe("先見的預言者");
  });

  it("clamps layer to valid range", () => {
    const name = getTypeName("INTJ", 0);
    expect(name).toBe("精密な実行者"); // clamped to layer 1
    const name2 = getTypeName("INTJ", 10);
    expect(name2).toBe("先見的預言者"); // clamped to layer 5
  });
});

describe("getTypeCode", () => {
  it("returns correct format", () => {
    expect(getTypeCode("ENTP", 3)).toBe("ENTP-L3");
    expect(getTypeCode("INTJ", 1)).toBe("INTJ-L1");
    expect(getTypeCode("ISFP", 5)).toBe("ISFP-L5");
  });
});

// ============================================================
// Data integrity checks
// ============================================================
describe("data integrity", () => {
  it("has exactly 16 base types", () => {
    expect(BASE_TYPES).toHaveLength(16);
  });

  it("has exactly 5 layer labels", () => {
    expect(LAYER_LABELS).toHaveLength(5);
  });

  it("TYPE_NAME_MATRIX covers all 16 base types with 5 names each", () => {
    for (const bt of BASE_TYPES) {
      expect(TYPE_NAME_MATRIX[bt]).toBeDefined();
      expect(TYPE_NAME_MATRIX[bt]).toHaveLength(5);
    }
    // 16 * 5 = 80 types total
    const totalNames = Object.values(TYPE_NAME_MATRIX).flat().length;
    expect(totalNames).toBe(80);
  });

  it("has exactly 20 base type questions (5 per dimension)", () => {
    expect(BASE_TYPE_QUESTIONS).toHaveLength(20);
    const dims = BASE_TYPE_QUESTIONS.reduce((acc, q) => {
      acc[q.dimension] = (acc[q.dimension] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    expect(dims["EI"]).toBe(5);
    expect(dims["SN"]).toBe(5);
    expect(dims["TF"]).toBe(5);
    expect(dims["JP"]).toBe(5);
  });

  it("has exactly 10 layer questions", () => {
    expect(LAYER_QUESTIONS).toHaveLength(10);
  });

  it("has exactly 10 power questions", () => {
    expect(POWER_QUESTIONS).toHaveLength(10);
  });

  it("each power question has exactly one correct answer", () => {
    for (const q of POWER_QUESTIONS) {
      const correctCount = q.options.filter((o) => o.correct).length;
      expect(correctCount).toBe(1);
    }
  });

  it("has exactly 3 shift scenarios", () => {
    expect(SHIFT_SCENARIOS).toHaveLength(3);
  });

  it("each shift scenario has at least 2 phases", () => {
    for (const s of SHIFT_SCENARIOS) {
      expect(s.phases.length).toBeGreaterThanOrEqual(2);
    }
  });
});
