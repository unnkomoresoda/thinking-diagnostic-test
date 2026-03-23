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
  patternIndex: number;
}

/**
 * Generate a random pattern ID for this session
 */
export function generatePatternId(): string {
  return `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get the current pattern for this diagnostic session
 * Selects a random pattern index (0-3) for use with pre-generated patterns
 * Falls back to default questions if patterns are not yet generated
 */
export function getCurrentPattern(): QuestionPattern {
  const patternId = generatePatternId();
  // Select random pattern index (0-3) for 4 pre-generated patterns
  const patternIndex = Math.floor(Math.random() * 4);
  
  // Store pattern index in session storage for later retrieval
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('diagnosticPatternIndex', patternIndex.toString());
  }
  
  return {
    layerQuestions: LAYER_QUESTIONS,
    powerQuestions: POWER_QUESTIONS,
    shiftScenarios: SHIFT_SCENARIOS,
    patternId,
    patternIndex,
  };
}

/**
 * Get the pattern index for this session
 */
export function getPatternIndex(): number {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('diagnosticPatternIndex');
    if (stored) return parseInt(stored, 10);
  }
  return Math.floor(Math.random() * 4);
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
