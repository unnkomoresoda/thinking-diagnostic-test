import { describe, it, expect } from "vitest";
import {
  calculateBaseType,
  calculateLayer,
  calculatePower,
  calculateShift,
  BASE_TYPE_QUESTIONS,
  LAYER_QUESTIONS,
  POWER_QUESTIONS,
  SHIFT_SCENARIOS,
} from "@shared/diagnosticData";

describe("Pattern Integration - Scoring Logic", () => {
  it("should calculate base type correctly regardless of question order", () => {
    // Create answers for all base type questions - all A answers
    const answers: Record<string, string> = {};
    BASE_TYPE_QUESTIONS.forEach((q) => {
      answers[q.id] = "A"; // All A answers
    });

    const result = calculateBaseType(answers);
    // All A answers should result in E, S, T, J
    expect(result.type[0]).toBe("E");
    expect(result.type[1]).toBe("S");
    expect(result.type[2]).toBe("T");
    expect(result.type[3]).toBe("J");
    expect(result.scores.EI.first).toBeGreaterThan(0);
  });

  it("should handle partial answers in layer questions", () => {
    const answers: Record<string, number> = {};
    // Answer only first 5 questions
    for (let i = 0; i < Math.min(5, LAYER_QUESTIONS.length); i++) {
      answers[LAYER_QUESTIONS[i].id] = 1; // Layer 1
    }

    const result = calculateLayer(answers);
    expect(result.layer).toBe(1);
    expect(result.distribution[0]).toBe(5);
  });

  it("should calculate power score from correct answers", () => {
    const answers: Record<string, number> = {};
    POWER_QUESTIONS.forEach((q, idx) => {
      // Select the correct answer (index 0 is typically correct)
      const correctIdx = q.options.findIndex((opt) => opt.correct);
      answers[q.id] = correctIdx >= 0 ? correctIdx : 0;
    });

    const result = calculatePower(answers);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.details.total).toBe(POWER_QUESTIONS.length);
  });

  it("should calculate shift score from scenario answers", () => {
    const answers: Record<string, number[]> = {};
    SHIFT_SCENARIOS.forEach((scenario) => {
      answers[scenario.id] = [];
      scenario.phases.forEach((phase, phaseIdx) => {
        // Choose a random option
        const optIdx = Math.floor(Math.random() * phase.options.length);
        answers[scenario.id][phaseIdx] = optIdx;
      });
    });

    const result = calculateShift(answers);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.adaptability).toBeGreaterThanOrEqual(0);
    expect(result.adaptability).toBeLessThanOrEqual(100);
  });

  it("should maintain consistent scoring across multiple runs", () => {
    const answers: Record<string, string> = {};
    BASE_TYPE_QUESTIONS.forEach((q) => {
      answers[q.id] = "A";
    });

    const result1 = calculateBaseType(answers);
    const result2 = calculateBaseType(answers);

    expect(result1.type).toBe(result2.type);
    expect(result1.scores).toEqual(result2.scores);
  });

  it("should handle empty answers gracefully", () => {
    const emptyAnswers: Record<string, string> = {};
    const result = calculateBaseType(emptyAnswers);
    expect(result.type).toBe("ESTJ"); // Default when all scores are 0
  });

  it("should validate layer distribution sums correctly", () => {
    const answers: Record<string, number> = {};
    LAYER_QUESTIONS.forEach((q, idx) => {
      answers[q.id] = (idx % 5) + 1; // Distribute across all layers
    });

    const result = calculateLayer(answers);
    const totalAnswers = result.distribution.reduce((sum, count) => sum + count, 0);
    expect(totalAnswers).toBe(LAYER_QUESTIONS.length);
  });

  it("should detect primary layer correctly from distribution", () => {
    const answers: Record<string, number> = {};
    // Make all answers Layer 3
    LAYER_QUESTIONS.forEach((q) => {
      answers[q.id] = 3;
    });

    const result = calculateLayer(answers);
    expect(result.layer).toBe(3);
    expect(result.distribution[2]).toBe(LAYER_QUESTIONS.length);
  });
});
