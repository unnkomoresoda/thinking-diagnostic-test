import type { LayerQuestion, PowerQuestion, ShiftScenario } from "@shared/diagnosticData";
import { LAYER_QUESTIONS, POWER_QUESTIONS, SHIFT_SCENARIOS } from "@shared/diagnosticData";

/**
 * Select a random question set for the diagnostic
 * This ensures each user gets a different set of questions
 */

export interface QuestionPattern {
  layerQuestions: LayerQuestion[];
  powerQuestions: PowerQuestion[];
  shiftScenarios: ShiftScenario[];
  patternId: string;
}

/**
 * Generate a random pattern ID for this session
 */
export function generatePatternId(): string {
  return `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get the current pattern for this diagnostic session
 * For now, returns the default questions
 * In the future, this will select from multiple LLM-generated patterns
 */
export function getCurrentPattern(): QuestionPattern {
  const patternId = generatePatternId();
  
  return {
    layerQuestions: LAYER_QUESTIONS,
    powerQuestions: POWER_QUESTIONS,
    shiftScenarios: SHIFT_SCENARIOS,
    patternId,
  };
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get a random subset of questions from a pattern
 * Useful for adaptive testing in the future
 */
export function getRandomQuestions<T extends { id: string }>(
  questions: T[],
  count: number = questions.length
): T[] {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, Math.min(count, questions.length));
}
