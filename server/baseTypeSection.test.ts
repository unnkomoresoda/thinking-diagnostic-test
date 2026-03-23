import { describe, it, expect } from "vitest";
import { BASE_TYPE_QUESTIONS } from "@shared/diagnosticData";

describe("Base Type Section - Button Rendering Logic", () => {
  it("should have unique question IDs", () => {
    const ids = BASE_TYPE_QUESTIONS.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
    expect(ids.length).toBe(40);
  });

  it("should have IDs from bt1 to bt40", () => {
    const ids = BASE_TYPE_QUESTIONS.map((q) => q.id);
    for (let i = 1; i <= 40; i++) {
      expect(ids).toContain(`bt${i}`);
    }
  });

  it("should have correct question index mapping", () => {
    BASE_TYPE_QUESTIONS.forEach((q, index) => {
      const expectedId = `bt${index + 1}`;
      expect(q.id).toBe(expectedId);
    });
  });

  it("should have 10 questions per dimension", () => {
    const dimensions = { EI: 0, SN: 0, TF: 0, JP: 0 };
    BASE_TYPE_QUESTIONS.forEach((q) => {
      dimensions[q.dimension]++;
    });
    expect(dimensions.EI).toBe(10);
    expect(dimensions.SN).toBe(10);
    expect(dimensions.TF).toBe(10);
    expect(dimensions.JP).toBe(10);
  });

  it("should render button numbers correctly (1-40)", () => {
    const buttonNumbers = BASE_TYPE_QUESTIONS.map((_, i) => i + 1);
    expect(buttonNumbers).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
  });

  it("should not have duplicate question IDs even with different indices", () => {
    const idToIndex: Record<string, number> = {};
    BASE_TYPE_QUESTIONS.forEach((q, index) => {
      if (idToIndex[q.id] !== undefined) {
        throw new Error(`Duplicate ID: ${q.id} at indices ${idToIndex[q.id]} and ${index}`);
      }
      idToIndex[q.id] = index;
    });
    expect(Object.keys(idToIndex).length).toBe(40);
  });

  it("should verify button 6 maps to bt6 and button 21 maps to bt21", () => {
    const button6Question = BASE_TYPE_QUESTIONS[5]; // index 5 = button 6
    const button21Question = BASE_TYPE_QUESTIONS[20]; // index 20 = button 21

    expect(button6Question.id).toBe("bt6");
    expect(button21Question.id).toBe("bt21");
    expect(button6Question.id).not.toBe(button21Question.id);
  });
});
