import { cn } from "@/lib/utils";
import { Check, Brain, Layers, Zap, Shuffle, Trophy } from "lucide-react";
import type { DiagnosticStep } from "@/hooks/useDiagnosticFlow";

const STEPS: { key: DiagnosticStep; label: string; icon: React.ReactNode }[] = [
  { key: "baseType", label: "Base Type", icon: <Brain className="w-4 h-4" /> },
  { key: "layer", label: "Layer", icon: <Layers className="w-4 h-4" /> },
  { key: "power", label: "Power", icon: <Zap className="w-4 h-4" /> },
  { key: "shift", label: "Shift", icon: <Shuffle className="w-4 h-4" /> },
  { key: "result", label: "結果", icon: <Trophy className="w-4 h-4" /> },
];

const STEP_ORDER: DiagnosticStep[] = ["intro", "baseType", "layer", "power", "shift", "submitting", "result"];

interface StepNavigationProps {
  currentStep: DiagnosticStep;
}

export function StepNavigation({ currentStep }: StepNavigationProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  if (currentStep === "intro") return null;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
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
              {i < STEPS.length - 1 && (
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
