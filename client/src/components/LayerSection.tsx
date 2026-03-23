import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LAYER_QUESTIONS } from "@shared/diagnosticData";
import { getCurrentPattern } from "@/lib/patternSelector";
import { cn } from "@/lib/utils";

interface LayerSectionProps {
  answers: Record<string, number>;
  onAnswer: (questionId: string, value: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function LayerSection({ answers, onAnswer, onNext, onPrev }: LayerSectionProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const pattern = getCurrentPattern();
  const questions = pattern.layerQuestions;
  const question = questions[currentQ];
  const totalAnswered = Object.keys(answers).length;
  const allAnswered = totalAnswered >= questions.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Cognitive Layer 診断</h2>
        <p className="text-muted-foreground text-sm">
          あなたの思考の解像度と時間軸（フォーカス）を測定します
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>質問 {currentQ + 1} / {questions.length}</span>
          <span>{totalAnswered} 回答済み</span>
        </div>
        <Progress value={(totalAnswered / questions.length) * 100} className="h-2" />
      </div>

      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="p-6">
          <p className="text-lg font-medium mb-6 leading-relaxed">{question.text}</p>

          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onAnswer(question.id, opt.layer);
                  if (currentQ < questions.length - 1) {
                    setTimeout(() => setCurrentQ(currentQ + 1), 300);
                  }
                }}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                  answers[question.id] === opt.layer
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    answers[question.id] === opt.layer
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {opt.layer}
                  </span>
                  <span className="text-sm leading-relaxed">{opt.label}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentQ(i)}
            className={cn(
              "w-7 h-7 rounded-full text-xs font-medium transition-all",
              i === currentQ && "ring-2 ring-primary ring-offset-2",
              answers[q.id] !== undefined ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Button>
        <Button onClick={onNext} disabled={!allAnswered} className="gap-2">
          次へ
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
