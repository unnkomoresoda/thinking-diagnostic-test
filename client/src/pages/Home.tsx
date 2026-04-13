import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Brain, Layers, Zap, Shuffle, ArrowRight, LogIn, History, Sparkles, BookOpen, Shield, HelpCircle } from "lucide-react";
import { useState } from "react";
import { DimensionModal } from "@/components/DimensionModal";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedDimension, setSelectedDimension] = useState<"baseType" | "layer" | "power" | "shift" | null>(null);

  const dimensions = [
    {
      id: "baseType" as const,
      icon: <Brain className="w-7 h-7" />,
      title: "Base Type",
      subtitle: "認知機能の優先順位",
      description: "16タイプの認知OS。あなたの思考の「デフォルト設定」を特定します。",
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      id: "layer" as const,
      icon: <Layers className="w-7 h-7" />,
      title: "Cognitive Layer",
      subtitle: "思考の解像度と時間軸",
      description: "実行・分析・戦略・システム・マクロの5段階で思考のフォーカスを測定します。",
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      id: "power" as const,
      icon: <Zap className="w-7 h-7" />,
      title: "Processing Power",
      subtitle: "論理的整合性の検知精度",
      description: "論理トラップを用いて、あなたの思考エンジンの「演算精度」を測定します。",
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      id: "shift" as const,
      icon: <Shuffle className="w-7 h-7" />,
      title: "Dynamic Shift",
      subtitle: "レイヤー間の移動能力",
      description: "状況変化に応じた思考の柔軟性と、適切なレイヤーへの切り替え速度を評価します。",
      color: "text-chart-5",
      bg: "bg-chart-5/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm">Thinking Blueprint</span>
          </div>
          <div className="flex items-center gap-2">

            {isAuthenticated && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="gap-1.5 text-xs">
                <History className="w-3.5 h-3.5" />
                診断履歴
              </Button>
            )}

            {!loading && !isAuthenticated && (
              <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
                <a href={getLoginUrl()}>
                  <LogIn className="w-3.5 h-3.5" />
                  ログイン
                </a>
              </Button>
            )}
            {isAuthenticated && user && (
              <span className="text-xs text-muted-foreground">{user.name}</span>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            80 Types Thinking Diagnostic
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            あなたの
            <span className="text-primary">思考の設計図</span>
            を
            <br className="hidden sm:block" />
            解き明かす
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            MBTIの16タイプを超え、4つの次元から80タイプの思考パターンを特定する
            次世代型思考診断テスト
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button size="lg" onClick={() => navigate("/diagnostic")} className="px-8 gap-2 text-base h-12">
              診断を開始する
              <ArrowRight className="w-5 h-5" />
            </Button>

            {isAuthenticated && (
              <Button variant="outline" size="lg" onClick={() => navigate("/history")} className="px-6 gap-2 h-12">
                <History className="w-5 h-5" />
                過去の結果を見る
              </Button>
            )}
          </div>

          <div className="inline-flex items-center gap-6 text-sm text-muted-foreground">
            <span>所要時間：約10〜15分</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>全4セクション</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>80タイプ判定</span>
          </div>
        </div>
      </section>

      {/* 4 Dimensions */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">4次元の思考特性を測定</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            従来のMBTI（16タイプ）に、思考の深度・精度・柔軟性を加えた多角的な診断
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dimensions.map((dim) => (
              <Card
                key={dim.title}
                className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedDimension(dim.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${dim.bg} ${dim.color} shrink-0`}>
                      {dim.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold mb-0.5">{dim.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{dim.subtitle}</p>
                          <p className="text-sm text-foreground/80 leading-relaxed">{dim.description}</p>
                        </div>
                        <HelpCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            💡 各項目をクリックして、詳しい説明を確認できます
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">診断の流れ</h2>
          <div className="space-y-6">
            {[
              { step: "01", title: "Base Type 診断", desc: "20問の質問で、あなたの認知機能の優先順位（16タイプ）を特定します。" },
              { step: "02", title: "Cognitive Layer 診断", desc: "10問の質問で、思考の解像度と時間軸（5段階のレイヤー）を測定します。" },
              { step: "03", title: "Processing Power 診断", desc: "10問の論理トラップで、思考エンジンの演算精度を測定します。" },
              { step: "04", title: "Dynamic Shift 診断", desc: "3つのシナリオで、状況変化に応じた思考の柔軟性を評価します。" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">あなたの思考の設計図を作成しませんか？</h2>
          <p className="text-muted-foreground mb-8">
            80タイプの中から、あなた固有の思考パターンを特定します
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/diagnostic")} className="px-8 gap-2 text-base h-12">
              無料で診断を始める
              <ArrowRight className="w-5 h-5" />
            </Button>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>80 Types Thinking Diagnostic — 次世代型思考診断テスト</p>
        </div>
      </footer>

      {/* Dimension Modal */}
      <DimensionModal
        isOpen={selectedDimension !== null}
        onClose={() => setSelectedDimension(null)}
        dimension={selectedDimension}
      />
    </div>
  );
}
