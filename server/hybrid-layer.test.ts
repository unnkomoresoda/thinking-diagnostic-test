import { describe, expect, it } from "vitest";
import { getTopLayers } from "@shared/diagnosticData";

describe("Hybrid Layer Detection", () => {
  it("should identify primary layer when one is clearly dominant", () => {
    const distribution = [0, 5, 1, 0, 0]; // L2 has 5, L3 has 1
    const result = getTopLayers(distribution);
    expect(result.primary).toBe(2);
    expect(result.secondary).toBeUndefined();
    expect(result.isHybrid).toBe(false);
  });

  it("should identify hybrid type when top 2 layers are equal", () => {
    const distribution = [0, 4, 4, 1, 0]; // L2 and L3 both have 4
    const result = getTopLayers(distribution);
    expect(result.primary).toBe(2);
    expect(result.secondary).toBe(3);
    expect(result.isHybrid).toBe(true);
  });

  it("should identify hybrid type when top 2 layers are very close (within 1)", () => {
    const distribution = [0, 4, 3, 1, 0]; // L2 has 4, L3 has 3 (difference of 1)
    const result = getTopLayers(distribution);
    expect(result.primary).toBe(2);
    expect(result.secondary).toBe(3);
    expect(result.isHybrid).toBe(true);
  });

  it("should not identify hybrid when difference is more than 1", () => {
    const distribution = [0, 5, 3, 1, 0]; // L2 has 5, L3 has 3 (difference of 2)
    const result = getTopLayers(distribution);
    expect(result.primary).toBe(2);
    expect(result.secondary).toBeUndefined();
    expect(result.isHybrid).toBe(false);
  });

  it("should handle all zeros (all layers equal, so hybrid)", () => {
    const distribution = [0, 0, 0, 0, 0];
    const result = getTopLayers(distribution);
    expect(result.primary).toBe(1);
    // When all are 0, sorted array will have all layers with 0 count
    // secondary will be layer 2 (second in sorted order)
    expect(result.secondary).toBe(2);
    // isHybrid = secondary !== undefined && 0 <= 0 + 1 = true
    expect(result.isHybrid).toBe(true);
  });

  it("should handle single non-zero value", () => {
    const distribution = [0, 0, 5, 0, 0];
    const result = getTopLayers(distribution);
    expect(result.primary).toBe(3);
    expect(result.secondary).toBeUndefined();
    expect(result.isHybrid).toBe(false);
  });

  it("should correctly order by count (descending)", () => {
    const distribution = [1, 2, 3, 4, 5]; // L5 > L4 > L3 > L2 > L1
    const result = getTopLayers(distribution);
    expect(result.primary).toBe(5);
    expect(result.secondary).toBe(4);
    expect(result.isHybrid).toBe(true); // 5 and 4 differ by 1
  });

  it("should identify user's actual case: Analysis and Strategy both strong", () => {
    // Simulating the user's case: L2 Analysis and L3 Strategy are both high
    const distribution = [0, 4, 4, 2, 0]; // L2=4, L3=4, L4=2
    const result = getTopLayers(distribution);
    expect(result.primary).toBe(2);
    expect(result.secondary).toBe(3);
    expect(result.isHybrid).toBe(true);
  });

  it("should handle realistic layer distribution", () => {
    // Typical distribution: some layers higher than others
    const distribution = [1, 3, 2, 1, 0];
    const result = getTopLayers(distribution);
    expect(result.primary).toBe(2); // L2 has 3 (highest)
    expect(result.secondary).toBe(3); // L3 has 2 (second highest)
    // isHybrid = secondary !== undefined && sorted[0].count <= sorted[1].count + 1
    // sorted[0].count = 3 (L2), sorted[1].count = 2 (L3)
    // 3 <= 2 + 1 = 3 <= 3 = true
    expect(result.isHybrid).toBe(true);
  });
});
