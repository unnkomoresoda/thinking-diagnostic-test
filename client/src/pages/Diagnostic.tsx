import { useState, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { DiagnosticIntro } from "@/components/DiagnosticIntro";
import { BaseTypeSection } from "@/components/BaseTypeSection";
import { LayerSection } from "@/components/LayerSection";
import { PowerSection } from "@/components/PowerSection";
import { ShiftSection } from "@/components/ShiftSection";
import { InlineResult } from "@/pages/DiagnosticResult";
import { toast } from "sonner";
import {
  calculateBaseType,
  calculateLayer,
  calculatePower,
  calculateShift,
  getTypeName,
  getTypeCode,
  LAYER_LABELS,
  LAYER_DESCRIPTIONS,
} from "@shared/diagnosticData";
import type { LayerLabel } from "@shared/diagnosticData";
import { cn } from "@/lib/utils";
import { Check, Brain, Layers, Zap, Shuffle, Trophy } from "lucide-react";

type Step = "intro" | "baseType" | "layer" | "power" | "shift" | "submitting" | "result";

const STEP_ITEMS: { key: Step; label: string; icon: React.ReactNode }[] = [
  { key: "baseType", label: "Base Type", icon: <Brain className="w-4 h-4" /> },
  { key: "layer", label: "Layer", icon: <Layers className="w-4 h-4" /> },
  { key: "power", label: "Power", icon: <Zap className="w-4 h-4" /> },
  { key: "shift", label: "Shift", icon: <Shuffle className="w-4 h-4" /> },
  { key: "result", label: "結果", icon: <Trophy className="w-4 h-4" /> },
];

const STEP_ORDER: Step[] = ["intro", "baseType", "layer", "power", "shift", "submitting", "result"];

function StepNav({ currentStep }: { currentStep: Step }) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentStep === "intro") return null;

  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <div className="flex items-center justify-between">
        {STEP_ITEMS.map((step, i) => {
          const stepIndex = STEP_ORDER.indexOf(step.key);
          const isCompleted = currentIndex > stepIndex;
          const isCurrent = currentStep === step.key || (currentStep === "submitting" && step.key === "result");
          const isUpcoming = !isCompleted && !isCurrent;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 text-sm font-medium",
                    isCompleted && "bg-primary text-primary-foreground shadow-md",
                    isCurrent && "bg-primary/20 text-primary ring-2 ring-primary ring-offset-2",
                    isUpcoming && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.icon}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors whitespace-nowrap",
                    isCompleted && "text-primary",
                    isCurrent && "text-primary",
                    isUpcoming && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEP_ITEMS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 mt-[-1.25rem] transition-colors duration-300",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Diagnostic() {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>("intro");
  const [baseTypeAnswers, setBaseTypeAnswers] = useState<Record<string, string>>({});
  const [layerAnswers, setLayerAnswers] = useState<Record<string, number>>({});
  const [powerAnswers, setPowerAnswers] = useState<Record<string, number>>({});
  const [shiftAnswers, setShiftAnswers] = useState<Record<string, number[]>>({});
  const [resultData, setResultData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const submitMutation = trpc.diagnostic.submit.useMutation();

  const handleBaseTypeAnswer = useCallback((qId: string, value: string) => {
    setBaseTypeAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const handleLayerAnswer = useCallback((qId: string, value: number) => {
    setLayerAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const handlePowerAnswer = useCallback((qId: string, value: number) => {
    setPowerAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const handleShiftAnswer = useCallback((scenarioId: string, phaseIndex: number, value: number) => {
    setShiftAnswers((prev) => {
      const arr = [...(prev[scenarioId] || [])];
      arr[phaseIndex] = value;
      return { ...prev, [scenarioId]: arr };
    });
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setStep("submitting");
    try {
      if (isAuthenticated) {
        // Server-side calculation + save
        const serverResult = await submitMutation.mutateAsync({
          baseTypeAnswers,
          layerAnswers,
          powerAnswers,
          shiftAnswers,
        });
        setResultData(serverResult);
        toast.success("診断結果を保存しました");
      } else {
        // Client-side calculation (no save)
        const baseResult = calculateBaseType(baseTypeAnswers);
        const layerResult = calculateLayer(layerAnswers);
        const powerResult = calculatePower(powerAnswers);
        const shiftResult = calculateShift(shiftAnswers);

        const typeName = getTypeName(baseResult.type, layerResult.layer);
        const typeCode = getTypeCode(baseResult.type, layerResult.layer);

        const dimensionScores = {
          E_I: Math.round(baseResult.scores.EI.first / Math.max(baseResult.scores.EI.first + baseResult.scores.EI.second, 1) * 100),
          S_N: Math.round(baseResult.scores.SN.first / Math.max(baseResult.scores.SN.first + baseResult.scores.SN.second, 1) * 100),
          T_F: Math.round(baseResult.scores.TF.first / Math.max(baseResult.scores.TF.first + baseResult.scores.TF.second, 1) * 100),
          J_P: Math.round(baseResult.scores.JP.first / Math.max(baseResult.scores.JP.first + baseResult.scores.JP.second, 1) * 100),
          layerDistribution: layerResult.distribution,
          processingPower: powerResult.score,
          dynamicShift: shiftResult.score,
          adaptability: shiftResult.adaptability,
          powerDetails: powerResult.details,
        };

        setResultData({
          baseType: baseResult.type,
          cognitiveLayer: layerResult.layer,
          layerLabel: LAYER_LABELS[layerResult.layer - 1],
          layerDescription: LAYER_DESCRIPTIONS[LAYER_LABELS[layerResult.layer - 1] as LayerLabel],
          processingPower: powerResult.score,
          dynamicShift: shiftResult.score,
          typeName,
          typeCode,
          dimensionScores,
        });
      }
      setStep("result");
    } catch (e) {
      toast.error("診断処理中にエラーが発生しました");
      console.error(e);
      setStep("shift"); // Go back to shift section on error
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setStep("intro");
    setBaseTypeAnswers({});
    setLayerAnswers({});
    setPowerAnswers({});
    setShiftAnswers({});
    setResultData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Step Navigation */}
      {step !== "intro" && step !== "result" && (
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <StepNav currentStep={step} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-8 sm:py-12">
        {step === "intro" && (
          <DiagnosticIntro onStart={() => setStep("baseType")} />
        )}
        {step === "baseType" && (
          <BaseTypeSection
            answers={baseTypeAnswers}
            onAnswer={handleBaseTypeAnswer}
            onNext={() => setStep("layer")}
            onPrev={() => setStep("intro")}
          />
        )}
        {step === "layer" && (
          <LayerSection
            answers={layerAnswers}
            onAnswer={handleLayerAnswer}
            onNext={() => setStep("power")}
            onPrev={() => setStep("baseType")}
          />
        )}
        {step === "power" && (
          <PowerSection
            answers={powerAnswers}
            onAnswer={handlePowerAnswer}
            onNext={() => setStep("shift")}
            onPrev={() => setStep("layer")}
          />
        )}
        {step === "shift" && (
          <ShiftSection
            answers={shiftAnswers}
            onAnswer={handleShiftAnswer}
            onSubmit={handleSubmit}
            onPrev={() => setStep("power")}
          />
        )}
        {step === "result" && resultData && (
          <InlineResult result={resultData} onRestart={handleRestart} />
        )}

        {/* Submitting overlay */}
        {(step === "submitting" || submitting) && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-lg font-medium">診断結果を計算中...</p>
              <p className="text-sm text-muted-foreground">4次元のスコアを統合しています</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
