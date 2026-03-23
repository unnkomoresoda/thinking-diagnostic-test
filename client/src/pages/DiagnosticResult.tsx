import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Layers, Zap, Shuffle, ArrowLeft, RotateCcw, History } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { LAYER_LABELS, LAYER_DESCRIPTIONS, getTopLayers } from "@shared/diagnosticData";
import type { LayerLabel } from "@shared/diagnosticData";

// For inline result display (no route, passed as props)
interface InlineResultProps {
  result: {
    baseType: string;
    cognitiveLayer: number;
    layerLabel: string;
    layerDescription: string;
    processingPower: number;
    dynamicShift: number;
    typeName: string;
    typeCode: string;
    dimensionScores: {
      E_I: number;
      S_N: number;
      T_F: number;
      J_P: number;
      layerDistribution: number[];
      processingPower: number;
      dynamicShift: number;
      adaptability: number;
      powerDetails: { correct: number; total: number };
    };
  };
  onRestart?: () => void;
}

export function InlineResult({ result, onRestart }: InlineResultProps) {
  const [, navigate] = useLocation();

  const radarData = [
    { subject: "E/I", value: result.dimensionScores.E_I, fullMark: 100 },
    { subject: "S/N", value: result.dimensionScores.S_N, fullMark: 100 },
    { subject: "T/F", value: result.dimensionScores.T_F, fullMark: 100 },
    { subject: "J/P", value: result.dimensionScores.J_P, fullMark: 100 },
    { subject: "Power", value: result.dimensionScores.processingPower, fullMark: 100 },
    { subject: "Shift", value: result.dimensionScores.dynamicShift, fullMark: 100 },
  ];

  const layerData = LAYER_LABELS.map((label, i) => ({
    name: label,
    value: result.dimensionScores.layerDistribution[i] || 0,
  }));

  const powerGrade =
    result.processingPower >= 90 ? "S" :
    result.processingPower >= 75 ? "A" :
    result.processingPower >= 60 ? "B" :
    result.processingPower >= 40 ? "C" : "D";

  const shiftGrade =
    result.dynamicShift >= 90 ? "S" :
    result.dynamicShift >= 75 ? "A" :
    result.dynamicShift >= 60 ? "B" :
    result.dynamicShift >= 40 ? "C" : "D";

  // Hybrid layer detection
  const topLayers = getTopLayers(result.dimensionScores.layerDistribution);
  const isHybrid = topLayers.isHybrid;
  const secondaryLabel = topLayers.secondary ? LAYER_LABELS[topLayers.secondary - 1] : null;
  const secondaryDesc = topLayers.secondary ? LAYER_DESCRIPTIONS[LAYER_LABELS[topLayers.secondary - 1] as LayerLabel] : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          診断完了
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          あなたは<span className="text-primary">「{result.typeName}」</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          {result.typeCode} — {result.baseType} × {result.layerLabel}
        </p>
      </div>

      {/* 4 Dimension Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <DimensionCard
          icon={<Brain className="w-5 h-5" />}
          title="Base Type"
          value={result.baseType}
          color="text-chart-1"
          bg="bg-chart-1/10"
        />
        <DimensionCard
          icon={<Layers className="w-5 h-5" />}
          title="Layer"
          value={`L${result.cognitiveLayer} ${result.layerLabel}`}
          color="text-chart-2"
          bg="bg-chart-2/10"
        />
        <DimensionCard
          icon={<Zap className="w-5 h-5" />}
          title="Power"
          value={`${result.processingPower}点 (${powerGrade})`}
          color="text-chart-3"
          bg="bg-chart-3/10"
        />
        <DimensionCard
          icon={<Shuffle className="w-5 h-5" />}
          title="Shift"
          value={`${result.dynamicShift}点 (${shiftGrade})`}
          color="text-chart-5"
          bg="bg-chart-5/10"
        />
      </div>

      {/* Layer Description & Hybrid Detection */}
      <Card className="mb-8 border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Cognitive Layer: {result.layerLabel}</CardTitle>
            {isHybrid && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                ハイブリッド型
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">メインレイヤー: L{topLayers.primary} {LAYER_LABELS[topLayers.primary - 1]}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {LAYER_DESCRIPTIONS[LAYER_LABELS[topLayers.primary - 1] as LayerLabel]}
            </p>
          </div>
          {isHybrid && secondaryLabel && secondaryDesc && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2 text-amber-700">サブレイヤー: L{topLayers.secondary} {secondaryLabel}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {secondaryDesc}
              </p>
              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs font-semibold text-amber-900 mb-1">💡 ハイブリッド型の強み</p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  あなたは{LAYER_LABELS[topLayers.primary - 1]}と{secondaryLabel}の両方の思考スタイルを持つハイブリッド型です。状況に応じて最適なレイヤーに切り替えられるため、複雑な問題解決に優れています。短期の実行と中長期の戦略の両立が可能な希少なタイプです。
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Radar Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">思考特性レーダー</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="スコア"
                  dataKey="value"
                  stroke="oklch(0.45 0.18 270)"
                  fill="oklch(0.45 0.18 270)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Layer Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">レイヤー分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={layerData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, "auto"]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="oklch(0.45 0.18 270)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Power Details */}
      <Card className="mb-8 border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Processing Power 詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-chart-3">
                {result.dimensionScores.powerDetails.correct}/{result.dimensionScores.powerDetails.total}
              </p>
              <p className="text-xs text-muted-foreground">正答数</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-chart-1">
                {result.processingPower}%
              </p>
              <p className="text-xs text-muted-foreground">正答率</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-chart-5">
                {result.dimensionScores.adaptability}%
              </p>
              <p className="text-xs text-muted-foreground">適応力</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type Description */}
      <Card className="mb-8 border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">あなたのタイプについて</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-1">Base Type: {result.baseType}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getBaseTypeDescription(result.baseType)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-1">Cognitive Layer: L{result.cognitiveLayer} ({result.layerLabel})</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.layerDescription}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-1">総合タイプ: {result.typeName}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.baseType}の認知特性をベースに、{result.layerLabel}レイヤーの思考解像度を持つタイプです。
              Processing Power {powerGrade}ランク（{result.processingPower}点）、
              Dynamic Shift {shiftGrade}ランク（{result.dynamicShift}点）の演算精度と適応力を備えています。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        {onRestart && (
          <Button variant="outline" onClick={onRestart} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            もう一度診断する
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate("/history")} className="gap-2">
          <History className="w-4 h-4" />
          診断履歴を見る
        </Button>
        <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          トップに戻る
        </Button>
      </div>
    </div>
  );
}

function DimensionCard({ icon, title, value, color, bg }: {
  icon: React.ReactNode; title: string; value: string; color: string; bg: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 text-center">
        <div className={`inline-flex p-2 rounded-lg ${bg} ${color} mb-2`}>{icon}</div>
        <p className="text-xs text-muted-foreground mb-1">{title}</p>
        <p className="text-sm font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function getBaseTypeDescription(baseType: string): string {
  const descriptions: Record<string, string> = {
    INTJ: "独立した戦略的思考者。長期的なビジョンを持ち、複雑な問題を体系的に解決する能力に優れています。",
    INTP: "論理的な分析者。理論的な探究心が強く、抽象的な概念を深く理解する能力を持っています。",
    ENTJ: "天性のリーダー。効率的な組織運営と戦略的な意思決定に長けています。",
    ENTP: "革新的な発想家。新しいアイデアを生み出し、既存の枠組みに挑戦することを好みます。",
    INFJ: "洞察力のある理想主義者。深い共感力と未来を見通す直感力を持っています。",
    INFP: "価値観に忠実な理想主義者。創造性と深い感受性で、意味のある変化を追求します。",
    ENFJ: "カリスマ的な指導者。人々の可能性を引き出し、共通の目標に向けて導く力を持っています。",
    ENFP: "情熱的な探求者。可能性に満ちた世界を見出し、人々を鼓舞する力を持っています。",
    ISTJ: "信頼できる実行者。責任感が強く、体系的なアプローチで確実に成果を出します。",
    ISFJ: "献身的な守護者。細やかな配慮と確実な実行力で、周囲を支えます。",
    ESTJ: "効率的な管理者。明確な基準と体系的なプロセスで組織を運営する力を持っています。",
    ESFJ: "調和を重視する協力者。人間関係を大切にし、チームの結束力を高めます。",
    ISTP: "実践的な問題解決者。手を動かしながら、効率的な解決策を見つけ出します。",
    ISFP: "感性豊かな表現者。美的感覚と柔軟性で、独自の価値を創造します。",
    ESTP: "行動力のある実践者。リスクを恐れず、即座に状況に対応する能力に優れています。",
    ESFP: "エネルギッシュなパフォーマー。人々を楽しませ、活気のある環境を創り出します。",
  };
  return descriptions[baseType] || "あなた固有の認知パターンを持つタイプです。";
}

// Route-based result page (for /result/:id)
export default function DiagnosticResultPage() {
  const [, params] = useRoute("/result/:id");
  const [, navigate] = useLocation();
  const id = params?.id ? parseInt(params.id, 10) : null;

  const { data: result, isLoading } = trpc.diagnostic.getById.useQuery(
    { id: id! },
    { enabled: id !== null }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">結果を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-4">結果が見つかりません</p>
          <Button onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            トップに戻る
          </Button>
        </div>
      </div>
    );
  }

  const scores = (result.dimensionScores || {}) as InlineResultProps["result"]["dimensionScores"];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <InlineResult
        result={{
          baseType: result.baseType,
          cognitiveLayer: result.cognitiveLayer,
          layerLabel: result.layerLabel ?? LAYER_LABELS[result.cognitiveLayer - 1],
          layerDescription: result.layerDescription ?? LAYER_DESCRIPTIONS[LAYER_LABELS[result.cognitiveLayer - 1] as LayerLabel],
          processingPower: result.processingPower,
          dynamicShift: result.dynamicShift,
          typeName: result.typeName,
          typeCode: result.typeCode,
          dimensionScores: scores,
        }}
        onRestart={() => navigate("/diagnostic")}
      />
    </div>
  );
}
