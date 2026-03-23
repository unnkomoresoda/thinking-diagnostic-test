import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Send, Info } from "lucide-react";
import { SHIFT_SCENARIOS } from "@shared/diagnosticData";
import { getCurrentPattern } from "@/lib/patternSelector";
import { cn } from "@/lib/utils";

interface ShiftSectionProps {
  answers: Record<string, number[]>;
  onAnswer: (scenarioId: string, phaseIndex: number, value: number) => void;
  onSubmit: () => void;
  onPrev: () => void;
}

export function ShiftSection({ answers, onAnswer, onSubmit, onPrev }: ShiftSectionProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const pattern = getCurrentPattern();
  const scenarios = pattern.shiftScenarios;
  const scenario = scenarios[currentScenario];
  const phase = scenario.phases[currentPhase];

  // Count total answered phases
  const totalPhases = scenarios.reduce((sum, s) => sum + s.phases.length, 0);
  const answeredPhases = Object.entries(answers).reduce(
    (sum, [, arr]) => sum + arr.filter((v) => v !== undefined).length,
    0
  );
  const allAnswered = answeredPhases >= totalPhases;

  const handleAnswer = (optIdx: number) => {
    onAnswer(scenario.id, currentPhase, optIdx);
    // Auto-advance
    setTimeout(() => {
      if (currentPhase < scenario.phases.length - 1) {
        setCurrentPhase(currentPhase + 1);
      } else if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setCurrentPhase(0);
      }
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Dynamic Shift 診断</h2>
        <p className="text-muted-foreground text-sm">
          状況変化に応じた思考の柔軟性とレイヤー間の切り替え能力を評価します
        </p>
      </div>

      <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-800">
          各シナリオは複数のフェーズで構成されています。状況が変化する中で、あなたがどのように思考を切り替えるかを測定します。
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>シナリオ {currentScenario + 1} / {scenarios.length} — フェーズ {currentPhase + 1} / {scenario.phases.length}</span>
          <span>{answeredPhases} / {totalPhases} 回答済み</span>
        </div>
        <Progress value={(answeredPhases / totalPhases) * 100} className="h-2" />
      </div>

      {/* Scenario context */}
      <Card className="mb-4 border-0 bg-muted/50">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">シナリオ</p>
          <p className="text-sm font-medium leading-relaxed">{scenario.situation}</p>
        </CardContent>
      </Card>

      {/* Phase question */}
      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              フェーズ {currentPhase + 1}
            </span>
          </div>
          <p className="text-lg font-medium mb-6 leading-relaxed">{phase.description}</p>

          <div className="space-y-3">
            {phase.options.map((opt, idx) => {
              const currentAnswer = answers[scenario.id]?.[currentPhase];
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                    currentAnswer === idx
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  )}
                >
                  <span className="text-sm leading-relaxed">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Scenario navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {scenarios.map((s, si) => (
          <div key={s.id} className="flex gap-1">
            {s.phases.map((_, pi) => {
              const isAnswered = answers[s.id]?.[pi] !== undefined;
              const isCurrent = si === currentScenario && pi === currentPhase;
              return (
                <button
                  key={pi}
                  onClick={() => { setCurrentScenario(si); setCurrentPhase(pi); }}
                  className={cn(
                    "w-6 h-6 rounded text-xs font-medium transition-all",
                    isCurrent && "ring-2 ring-primary ring-offset-1",
                    isAnswered ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {si + 1}.{pi + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Button>
        <Button onClick={onSubmit} disabled={!allAnswered} className="gap-2">
          <Send className="w-4 h-4" />
          診断結果を見る
        </Button>
      </div>
    </div>
  );
}
