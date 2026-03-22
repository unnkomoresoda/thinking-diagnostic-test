import { useState, useCallback } from "react";

export type DiagnosticStep = "intro" | "baseType" | "layer" | "power" | "shift" | "submitting" | "result";

const STEP_ORDER: DiagnosticStep[] = ["intro", "baseType", "layer", "power", "shift", "submitting", "result"];

export interface DiagnosticAnswers {
  baseTypeAnswers: Record<string, string>;
  layerAnswers: Record<string, number>;
  powerAnswers: Record<string, number>;
  shiftAnswers: Record<string, number[]>;
}

export function useDiagnosticFlow() {
  const [currentStep, setCurrentStep] = useState<DiagnosticStep>("intro");
  const [answers, setAnswers] = useState<DiagnosticAnswers>({
    baseTypeAnswers: {},
    layerAnswers: {},
    powerAnswers: {},
    shiftAnswers: {},
  });
  const [resultId, setResultId] = useState<number | null>(null);

  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const progress = Math.round((stepIndex / (STEP_ORDER.length - 1)) * 100);

  const goToStep = useCallback((step: DiagnosticStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[idx + 1]);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(STEP_ORDER[idx - 1]);
    }
  }, [currentStep]);

  const updateBaseTypeAnswer = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      baseTypeAnswers: { ...prev.baseTypeAnswers, [questionId]: value },
    }));
  }, []);

  const updateLayerAnswer = useCallback((questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      layerAnswers: { ...prev.layerAnswers, [questionId]: value },
    }));
  }, []);

  const updatePowerAnswer = useCallback((questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      powerAnswers: { ...prev.powerAnswers, [questionId]: value },
    }));
  }, []);

  const updateShiftAnswer = useCallback((scenarioId: string, phaseIndex: number, value: number) => {
    setAnswers(prev => {
      const existing = prev.shiftAnswers[scenarioId] || [];
      const updated = [...existing];
      updated[phaseIndex] = value;
      return {
        ...prev,
        shiftAnswers: { ...prev.shiftAnswers, [scenarioId]: updated },
      };
    });
  }, []);

  const reset = useCallback(() => {
    setCurrentStep("intro");
    setAnswers({
      baseTypeAnswers: {},
      layerAnswers: {},
      powerAnswers: {},
      shiftAnswers: {},
    });
    setResultId(null);
  }, []);

  return {
    currentStep,
    stepIndex,
    progress,
    answers,
    resultId,
    setResultId,
    goToStep,
    nextStep,
    prevStep,
    updateBaseTypeAnswer,
    updateLayerAnswer,
    updatePowerAnswer,
    updateShiftAnswer,
    reset,
  };
}
