import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Brain, Layers, Zap, Shuffle, ArrowRight, LogIn, Info } from "lucide-react";

interface DiagnosticIntroProps {
  onStart: () => void;
}

export function DiagnosticIntro({ onStart }: DiagnosticIntroProps) {
  const { isAuthenticated, loading } = useAuth();

  const dimensions = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Base Type",
      subtitle: "認知機能の優先順位",
      description: "16タイプの認知OS。あなたの思考の「デフォルト設定」を特定します。",
      questions: "20問",
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Cognitive Layer",
      subtitle: "思考の解像度と時間軸",
      description: "実行・分析・戦略・システム・マクロの5段階で思考のフォーカスを測定します。",
      questions: "10問",
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Processing Power",
      subtitle: "論理的整合性の検知精度",
      description: "論理トラップを用いて、あなたの思考エンジンの「演算精度」を測定します。",
      questions: "10問",
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      icon: <Shuffle className="w-6 h-6" />,
      title: "Dynamic Shift",
      subtitle: "レイヤー間の移動能力",
      description: "状況変化に応じた思考の柔軟性と、適切なレイヤーへの切り替え速度を評価します。",
      questions: "3シナリオ",
      color: "text-chart-5",
      bg: "bg-chart-5/10",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Brain className="w-4 h-4" />
          80 Types Thinking Diagnostic
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          あなたの<span className="text-primary">思考の設計図</span>を
          <br />
          解き明かす
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          MBTIの16タイプを超え、4つの次元から80タイプの思考パターンを特定する
          次世代型思考診断テスト
        </p>
      </div>

      {/* 4 Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {dimensions.map((dim) => (
          <Card key={dim.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${dim.bg} ${dim.color} shrink-0`}>
                  {dim.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm">{dim.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{dim.questions}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{dim.subtitle}</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{dim.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-6 text-sm text-muted-foreground">
          <span>所要時間：約10〜15分</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>全4セクション</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>80タイプ判定</span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        {loading ? (
          <Button size="lg" disabled className="px-8 gap-2">
            読み込み中...
          </Button>
        ) : (
          <div className="space-y-4">
            <Button size="lg" onClick={onStart} className="px-8 gap-2 text-base">
              診断を開始する
              <ArrowRight className="w-5 h-5" />
            </Button>
            {!isAuthenticated && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Info className="w-3.5 h-3.5" />
                <span>
                  <a href={getLoginUrl()} className="text-primary hover:underline">ログイン</a>
                  すると診断結果を保存できます（ログインなしでも診断可能）
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
