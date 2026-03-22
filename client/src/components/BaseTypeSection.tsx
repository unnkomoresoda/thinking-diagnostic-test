import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BASE_TYPE_QUESTIONS } from "@shared/diagnosticData";
import { cn } from "@/lib/utils";

interface BaseTypeSectionProps {
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function BaseTypeSection({ answers, onAnswer, onNext, onPrev }: BaseTypeSectionProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const questions = BASE_TYPE_QUESTIONS;
  const question = questions[currentQ];
  const totalAnswered = Object.keys(answers).length;
  const allAnswered = totalAnswered >= questions.length;

  // Use "A" / "B" as answer values to match calculateBaseType logic
  const options = [
    { value: "A", label: question.optionA.label },
    { value: "B", label: question.optionB.label },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Base Type 診断</h2>
        <p className="text-muted-foreground text-sm">
          あなたの認知機能の優先順位（思考のOS）を特定します
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
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
            {question.dimension} 軸
          </p>
          <p className="text-lg font-medium mb-6 leading-relaxed">{question.text}</p>

          <div className="space-y-3">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onAnswer(question.id, opt.value);
                  if (currentQ < questions.length - 1) {
                    setTimeout(() => setCurrentQ(currentQ + 1), 300);
                  }
                }}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                  answers[question.id] === opt.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                )}
              >
                <span className="text-sm leading-relaxed">{opt.label}</span>
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
              answers[q.id] ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
