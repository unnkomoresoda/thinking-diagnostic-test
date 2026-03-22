import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import { useLocation, Link } from "wouter";
import {
  Brain, Layers, Search, ArrowRight, LogIn, History, BookOpen,
  ChevronDown, Grid3X3, List, Home as HomeIcon
} from "lucide-react";
import {
  TYPE_DESCRIPTIONS,
  type TypeDescription,
} from "../../../shared/typeDescriptions";
import {
  BASE_TYPES,
  TYPE_NAME_MATRIX,
  LAYER_LABELS,
  LAYER_DESCRIPTIONS,
  type BaseType,
} from "../../../shared/diagnosticData";

const MBTI_GROUPS = [
  { label: "分析家 (NT)", types: ["INTJ", "INTP", "ENTJ", "ENTP"] as BaseType[], color: "bg-purple-100 text-purple-800" },
  { label: "外交官 (NF)", types: ["INFJ", "INFP", "ENFJ", "ENFP"] as BaseType[], color: "bg-green-100 text-green-800" },
  { label: "番人 (SJ)", types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"] as BaseType[], color: "bg-blue-100 text-blue-800" },
  { label: "探検家 (SP)", types: ["ISTP", "ISFP", "ESTP", "ESFP"] as BaseType[], color: "bg-orange-100 text-orange-800" },
];

const LAYER_COLORS = [
  "bg-emerald-100 text-emerald-800",
  "bg-sky-100 text-sky-800",
  "bg-amber-100 text-amber-800",
  "bg-violet-100 text-violet-800",
  "bg-rose-100 text-rose-800",
];

type ViewMode = "grid" | "table";
type FilterMode = "all" | "baseType" | "layer";

export default function TypeCatalog() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [selectedBaseType, setSelectedBaseType] = useState<BaseType | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);

  const filteredTypes = useMemo(() => {
    let result = TYPE_DESCRIPTIONS;

    if (selectedBaseType) {
      result = result.filter((t) => t.code.startsWith(selectedBaseType + "-"));
    }
    if (selectedLayer !== null) {
      result = result.filter((t) => t.code.endsWith("-L" + selectedLayer));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.code.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          getTypeName(t.code).toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, selectedBaseType, selectedLayer]);

  function getTypeName(code: string): string {
    const [bt, layerStr] = code.split("-");
    const layerIdx = parseInt(layerStr.replace("L", "")) - 1;
    const matrix = TYPE_NAME_MATRIX[bt as BaseType];
    return matrix ? matrix[layerIdx] : code;
  }

  function getLayerBadgeColor(code: string): string {
    const layerIdx = parseInt(code.split("-L")[1]) - 1;
    return LAYER_COLORS[layerIdx] || LAYER_COLORS[0];
  }

  function getMBTIGroupColor(code: string): string {
    const bt = code.split("-")[0];
    const group = MBTI_GROUPS.find((g) => g.types.includes(bt as BaseType));
    return group?.color || "bg-gray-100 text-gray-800";
  }

  function clearFilters() {
    setSelectedBaseType(null);
    setSelectedLayer(null);
    setSearchQuery("");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">Thinking Blueprint</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5 text-xs">
              <HomeIcon className="w-3.5 h-3.5" />
              ホーム
            </Button>
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

      {/* Hero */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            80 Types Encyclopedia
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            80タイプ思考カタログ
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
            16のBase Type × 5つのCognitive Layerから生まれる80の思考パターン。
            あなたのタイプを見つけてみましょう。
          </p>
          <Button size="lg" onClick={() => navigate("/diagnostic")} className="gap-2">
            診断を受ける
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-background sticky top-14 z-[5]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="タイプ名・コードで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Base Type Filter */}
            <div className="flex flex-wrap gap-1.5">
              {MBTI_GROUPS.map((group) => (
                <div key={group.label} className="flex gap-0.5">
                  {group.types.map((bt) => (
                    <button
                      key={bt}
                      onClick={() => setSelectedBaseType(selectedBaseType === bt ? null : bt)}
                      className={`px-2 py-1 text-xs rounded-md font-mono transition-all ${
                        selectedBaseType === bt
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {bt}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Layer Filter */}
            <div className="flex gap-1">
              {LAYER_LABELS.map((label, idx) => (
                <button
                  key={label}
                  onClick={() => setSelectedLayer(selectedLayer === idx + 1 ? null : idx + 1)}
                  className={`px-2 py-1 text-xs rounded-md transition-all ${
                    selectedLayer === idx + 1
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  L{idx + 1}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 ml-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md ${viewMode === "table" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(selectedBaseType || selectedLayer || searchQuery) && (
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-muted-foreground">フィルター:</span>
              {selectedBaseType && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSelectedBaseType(null)}>
                  {selectedBaseType} ×
                </Badge>
              )}
              {selectedLayer && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSelectedLayer(null)}>
                  L{selectedLayer} ({LAYER_LABELS[selectedLayer - 1]}) ×
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setSearchQuery("")}>
                  "{searchQuery}" ×
                </Badge>
              )}
              <button onClick={clearFilters} className="text-primary hover:underline ml-1">
                すべてクリア
              </button>
              <span className="text-muted-foreground ml-auto">{filteredTypes.length}件</span>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          {filteredTypes.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">該当するタイプが見つかりませんでした</p>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-2">
                フィルターをクリア
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTypes.map((type) => (
                <TypeCard
                  key={type.code}
                  type={type}
                  typeName={getTypeName(type.code)}
                  layerBadgeColor={getLayerBadgeColor(type.code)}
                  mbtiGroupColor={getMBTIGroupColor(type.code)}
                />
              ))}
            </div>
          ) : (
            <TypeTable
              types={filteredTypes}
              getTypeName={getTypeName}
              getLayerBadgeColor={getLayerBadgeColor}
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>80 Types Thinking Diagnostic — 次世代型思考診断テスト</p>
        </div>
      </footer>
    </div>
  );
}

function TypeCard({
  type,
  typeName,
  layerBadgeColor,
  mbtiGroupColor,
}: {
  type: TypeDescription;
  typeName: string;
  layerBadgeColor: string;
  mbtiGroupColor: string;
}) {
  const [bt, layerStr] = type.code.split("-");
  const layerIdx = parseInt(layerStr.replace("L", "")) - 1;

  return (
    <Link href={`/types/${type.code}`}>
      <Card className="h-full border hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-1.5">
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${mbtiGroupColor}`}>
                {bt}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${layerBadgeColor}`}>
                L{layerIdx + 1}
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-primary transition-all" />
          </div>
          <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
            {typeName}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
            {type.summary}
          </p>
          <div className="flex flex-wrap gap-1">
            {type.strengths.slice(0, 2).map((s, i) => (
              <span key={i} className="text-[10px] bg-primary/5 text-primary/80 px-1.5 py-0.5 rounded">
                {s}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TypeTable({
  types,
  getTypeName,
  getLayerBadgeColor,
}: {
  types: TypeDescription[];
  getTypeName: (code: string) => string;
  getLayerBadgeColor: (code: string) => string;
}) {
  const [, navigate] = useLocation();

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">コード</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">タイプ名</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">レイヤー</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">概要</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">強み</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => {
              const layerIdx = parseInt(type.code.split("-L")[1]) - 1;
              return (
                <tr
                  key={type.code}
                  className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/types/${type.code}`)}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-medium">{type.code}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">{getTypeName(type.code)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${getLayerBadgeColor(type.code)}`}>
                      {LAYER_LABELS[layerIdx]}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-muted-foreground text-xs line-clamp-1">{type.summary}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex gap-1">
                      {type.strengths.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[10px] bg-primary/5 text-primary/80 px-1.5 py-0.5 rounded whitespace-nowrap">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
