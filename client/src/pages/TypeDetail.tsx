import { useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getLoginUrl } from "@/const";
import { useLocation, useParams, Link } from "wouter";
import {
  Brain, ArrowLeft, ArrowRight, LogIn, History, BookOpen,
  Star, AlertTriangle, Briefcase, Users, MessageCircle,
  TrendingUp, Zap, Heart, ChevronLeft, ChevronRight, Home as HomeIcon
} from "lucide-react";
import {
  getTypeDescription,
  getTypesByBaseType,
  TYPE_DESCRIPTIONS,
  type TypeDescription,
} from "../../../shared/typeDescriptions";
import {
  TYPE_NAME_MATRIX,
  LAYER_LABELS,
  LAYER_DESCRIPTIONS,
  type BaseType,
  type LayerLabel,
} from "../../../shared/diagnosticData";

const LAYER_COLORS = [
  { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800" },
  { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", badge: "bg-sky-100 text-sky-800" },
  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-800" },
  { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", badge: "bg-violet-100 text-violet-800" },
  { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", badge: "bg-rose-100 text-rose-800" },
];

const MBTI_GROUP_COLORS: Record<string, string> = {
  NT: "bg-purple-100 text-purple-800",
  NF: "bg-green-100 text-green-800",
  SJ: "bg-blue-100 text-blue-800",
  SP: "bg-orange-100 text-orange-800",
};

function getMBTIGroup(bt: string): string {
  const second = bt[1]; // N or S
  const third = bt[2]; // T or F
  const fourth = bt[3]; // J or P
  if (second === "N" && (third === "T")) return "NT";
  if (second === "N" && (third === "F")) return "NF";
  if (second === "S" && (fourth === "J")) return "SJ";
  if (second === "S" && (fourth === "P")) return "SP";
  return "NT";
}

export default function TypeDetail() {
  const { code } = useParams<{ code: string }>();
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const typeData = useMemo(() => code ? getTypeDescription(code) : undefined, [code]);

  const bt = code?.split("-")[0] as BaseType | undefined;
  const layerNum = code ? parseInt(code.split("-L")[1]) : 0;
  const layerIdx = layerNum - 1;
  const layerLabel = layerIdx >= 0 ? LAYER_LABELS[layerIdx] : undefined;
  const layerColor = layerIdx >= 0 ? LAYER_COLORS[layerIdx] : LAYER_COLORS[0];

  const typeName = useMemo(() => {
    if (!bt || layerIdx < 0) return code || "";
    const matrix = TYPE_NAME_MATRIX[bt];
    return matrix ? matrix[layerIdx] : code || "";
  }, [bt, layerIdx, code]);

  // Navigation: same base type, different layers
  const siblingTypes = useMemo(() => {
    if (!bt) return [];
    return getTypesByBaseType(bt);
  }, [bt]);

  // Previous/Next type in full list
  const { prevType, nextType } = useMemo(() => {
    if (!code) return { prevType: null, nextType: null };
    const idx = TYPE_DESCRIPTIONS.findIndex((t) => t.code === code);
    return {
      prevType: idx > 0 ? TYPE_DESCRIPTIONS[idx - 1] : null,
      nextType: idx < TYPE_DESCRIPTIONS.length - 1 ? TYPE_DESCRIPTIONS[idx + 1] : null,
    };
  }, [code]);

  // Compatible types info
  const compatibleTypesData = useMemo(() => {
    if (!typeData) return [];
    return typeData.compatibleTypes
      .map((c) => {
        const td = getTypeDescription(c);
        if (!td) return null;
        const [cBt, cL] = c.split("-");
        const cLayerIdx = parseInt(cL.replace("L", "")) - 1;
        const cName = TYPE_NAME_MATRIX[cBt as BaseType]?.[cLayerIdx] || c;
        return { ...td, typeName: cName };
      })
      .filter(Boolean) as (TypeDescription & { typeName: string })[];
  }, [typeData]);

  if (!typeData || !bt || !layerLabel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">タイプが見つかりません</h2>
          <p className="text-muted-foreground text-sm mb-4">コード「{code}」に該当するタイプは存在しません。</p>
          <Button onClick={() => navigate("/types")} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            タイプ一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  const mbtiGroup = getMBTIGroup(bt);
  const mbtiGroupColor = MBTI_GROUP_COLORS[mbtiGroup] || MBTI_GROUP_COLORS.NT;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">Thinking Blueprint</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/types")} className="gap-1.5 text-xs">
              <BookOpen className="w-3.5 h-3.5" />
              タイプ一覧
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5 text-xs">
              <HomeIcon className="w-3.5 h-3.5" />
              ホーム
            </Button>
            {!loading && !isAuthenticated && (
              <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
                <a href={getLoginUrl()}>
                  <LogIn className="w-3.5 h-3.5" />
                  ログイン
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/types" className="hover:text-primary transition-colors">タイプ一覧</Link>
          <span>/</span>
          <span className="font-mono">{bt}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{code}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className={`py-10 sm:py-14 ${layerColor.bg} border-b ${layerColor.border}`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-mono px-2 py-1 rounded font-medium ${mbtiGroupColor}`}>
                  {bt}
                </span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${layerColor.badge}`}>
                  L{layerNum} · {layerLabel}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                {typeName}
              </h1>
              <p className="text-lg text-foreground/80 leading-relaxed mb-4">
                {typeData.summary}
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Code: {code}
              </p>
            </div>
            <div className="shrink-0">
              <Button onClick={() => navigate("/diagnostic")} className="gap-2">
                このタイプか診断する
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    タイプの特徴
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {typeData.description}
                  </p>
                </CardContent>
              </Card>

              {/* Cognitive Layer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Cognitive Layer: {layerLabel}（L{layerNum}）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/90 mb-4">
                    {LAYER_DESCRIPTIONS[layerLabel as LayerLabel]}
                  </p>
                  {/* Layer visualization */}
                  <div className="flex gap-1">
                    {LAYER_LABELS.map((l, i) => (
                      <div
                        key={l}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          i === layerIdx ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                    <span>L1 実行</span>
                    <span>L5 マクロ</span>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      強み
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {typeData.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      弱み
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {typeData.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Careers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    適職・活躍できるフィールド
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {typeData.careers.map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-sm py-1 px-3">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Communication & Stress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      コミュニケーション
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {typeData.communicationStyle}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      ストレス時の反応
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {typeData.stressResponse}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Growth Advice */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    成長のアドバイス
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    {typeData.growthAdvice}
                  </p>
                </CardContent>
              </Card>

              {/* Famous People */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    このタイプの有名人
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {typeData.famousPeople.map((p, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                          {i + 1}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Compatible Types */}
              {compatibleTypesData.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      相性の良いタイプ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {compatibleTypesData.map((ct) => (
                      <Link key={ct.code} href={`/types/${ct.code}`}>
                        <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-medium">{ct.code}</span>
                          </div>
                          <p className="text-sm font-medium">{ct.typeName}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ct.summary}</p>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Same Base Type, Different Layers */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    {bt}の他のレイヤー
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {siblingTypes.map((st) => {
                    const stLayerIdx = parseInt(st.code.split("-L")[1]) - 1;
                    const stName = TYPE_NAME_MATRIX[bt]?.[stLayerIdx] || st.code;
                    const isCurrent = st.code === code;
                    return (
                      <Link key={st.code} href={`/types/${st.code}`}>
                        <div
                          className={`p-2 rounded-lg flex items-center gap-3 transition-colors ${
                            isCurrent
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50 cursor-pointer"
                          }`}
                        >
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${LAYER_COLORS[stLayerIdx].badge}`}>
                            L{stLayerIdx + 1}
                          </span>
                          <span className={`text-sm ${isCurrent ? "font-semibold text-primary" : ""}`}>
                            {stName}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-primary ml-auto">現在</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <Separator className="my-8" />
          <div className="flex items-center justify-between">
            {prevType ? (
              <Link href={`/types/${prevType.code}`}>
                <Button variant="ghost" className="gap-2 text-sm">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{prevType.code}</span>
                  <span className="sm:hidden">前へ</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}
            <Button variant="outline" onClick={() => navigate("/types")} className="gap-2 text-sm">
              <BookOpen className="w-4 h-4" />
              一覧に戻る
            </Button>
            {nextType ? (
              <Link href={`/types/${nextType.code}`}>
                <Button variant="ghost" className="gap-2 text-sm">
                  <span className="hidden sm:inline">{nextType.code}</span>
                  <span className="sm:hidden">次へ</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>80 Types Thinking Diagnostic — 次世代型思考診断テスト</p>
        </div>
      </footer>
    </div>
  );
}
