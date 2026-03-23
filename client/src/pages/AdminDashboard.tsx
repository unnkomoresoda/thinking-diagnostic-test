import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import {
  Brain,
  Users,
  BarChart3,
  ClipboardList,
  ArrowLeft,
  Shield,
  Layers,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { LAYER_LABELS } from "@shared/diagnosticData";

const PAGE_SIZE = 50;

// Simple bar chart component
function HorizontalBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium w-16 text-right shrink-0">{label}</span>
      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right">{value}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statsTab, setStatsTab] = useState<"overall" | "monthly">("overall");
  const [mainTab, setMainTab] = useState<"stats" | "patterns">("stats");

  const isAdmin = user?.role === "admin";

  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery(undefined, {
    enabled: isAdmin,
  });

  const { data: monthlyStats, isLoading: monthlyStatsLoading } = trpc.admin.monthlyStats.useQuery(undefined, {
    enabled: isAdmin,
  });

  const { data: results, isLoading: resultsLoading } = trpc.admin.allResults.useQuery(
    { limit: PAGE_SIZE, offset: page * PAGE_SIZE },
    { enabled: isAdmin }
  );

  const { data: typeDistribution, isLoading: typeDistributionLoading } = trpc.admin.typeDistribution.useQuery(undefined, {
    enabled: isAdmin,
  });

  const generatePatternsMutation = trpc.admin.generatePatterns.useMutation();
  const { data: layerPatterns, refetch: refetchLayerPatterns } = trpc.admin.getPatterns.useQuery(
    { patternType: "layer" },
    { enabled: isAdmin }
  );
  const { data: powerPatterns, refetch: refetchPowerPatterns } = trpc.admin.getPatterns.useQuery(
    { patternType: "power" },
    { enabled: isAdmin }
  );
  const { data: shiftPatterns, refetch: refetchShiftPatterns } = trpc.admin.getPatterns.useQuery(
    { patternType: "shift" },
    { enabled: isAdmin }
  );
  const savedPatterns = (layerPatterns?.length ?? 0) + (powerPatterns?.length ?? 0) + (shiftPatterns?.length ?? 0);

  const handleGeneratePatterns = async () => {
    try {
      await generatePatternsMutation.mutateAsync();
      alert("パターンを生成・保存しました！");
    } catch (error) {
      alert("パターン生成に失敗しました: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  // Filter results by search
  const filteredResults = useMemo(() => {
    if (!results) return [];
    if (!searchQuery.trim()) return results;
    const q = searchQuery.toLowerCase();
    return results.filter(
      (r) =>
        r.userName?.toLowerCase().includes(q) ||
        r.userEmail?.toLowerCase().includes(q) ||
        r.typeCode.toLowerCase().includes(q) ||
        r.typeName.toLowerCase().includes(q) ||
        r.baseType.toLowerCase().includes(q)
    );
  }, [results, searchQuery]);

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">アクセス権限がありません</h2>
            <p className="text-muted-foreground mb-6">
              このページは管理者のみアクセスできます。
            </p>
            <Button onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              ホームに戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const baseTypeColors = [
    "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
    "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-lime-500",
    "bg-pink-500", "bg-teal-500", "bg-orange-500", "bg-sky-500",
    "bg-fuchsia-500", "bg-green-500", "bg-red-500", "bg-yellow-500",
  ];

  const layerColors = [
    "bg-emerald-500", "bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-rose-500",
  ];

  const maxBaseTypeCount = stats?.baseTypeDist
    ? Math.max(...stats.baseTypeDist.map((d) => d.count), 1)
    : 1;

  const maxLayerCount = stats?.layerDist
    ? Math.max(...stats.layerDist.map((d) => d.count), 1)
    : 1;

  const maxTypeCount = typeDistribution
    ? Math.max(...typeDistribution.map((d) => d.count), 1)
    : 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              ホーム
            </Button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">管理者ダッシュボード</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Admin: {user?.name}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Pattern Generation Section */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Layers className="w-5 h-5" />
              質問パターン管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-800 mb-4">
              診断時に異なる質問セットを使用するために、パターンを生成・保存します。
              {savedPatterns > 0 && (
                <span className="ml-2 font-semibold">✓ {savedPatterns}個のパターンが保存済み</span>
              )}
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={handleGeneratePatterns}
                disabled={generatePatternsMutation.isPending}
                className="gap-2"
              >
                {generatePatternsMutation.isPending ? "生成中..." : "パターンを生成・保存"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setMainTab("patterns")}
                className="gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                パターン管理
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">総診断数</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : stats?.totalCount ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-chart-2/10">
                  <Users className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ユニークユーザー</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : stats?.uniqueUsers ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-chart-3/10">
                  <Brain className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Base Type種類</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : stats?.baseTypeDist?.length ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-chart-5/10">
                  <TrendingUp className="w-5 h-5 text-chart-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">人気タイプ</p>
                  <p className="text-lg font-bold truncate">
                    {statsLoading ? "..." : stats?.typeCodeDist?.[0]?.typeCode ?? "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Base Type Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Base Type 分布
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {statsLoading ? (
                <div className="text-sm text-muted-foreground py-8 text-center">読み込み中...</div>
              ) : stats?.baseTypeDist?.length ? (
                stats.baseTypeDist.map((d, i) => (
                  <HorizontalBar
                    key={d.baseType}
                    label={d.baseType}
                    value={d.count}
                    max={maxBaseTypeCount}
                    color={baseTypeColors[i % baseTypeColors.length]}
                  />
                ))
              ) : (
                <div className="text-sm text-muted-foreground py-8 text-center">
                  まだ診断データがありません
                </div>
              )}
            </CardContent>
          </Card>

          {/* Layer Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Cognitive Layer 分布
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {statsLoading ? (
                <div className="text-sm text-muted-foreground py-8 text-center">読み込み中...</div>
              ) : stats?.layerDist?.length ? (
                stats.layerDist.map((d, i) => (
                  <HorizontalBar
                    key={d.layer}
                    label={`L${d.layer} ${LAYER_LABELS[d.layer - 1] ?? ""}`}
                    value={d.count}
                    max={maxLayerCount}
                    color={layerColors[i % layerColors.length]}
                  />
                ))
              ) : (
                <div className="text-sm text-muted-foreground py-8 text-center">
                  まだ診断データがありません
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Type Codes */}
        {stats?.typeCodeDist?.length ? (
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                人気タイプ TOP {stats.typeCodeDist.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.typeCodeDist.map((d) => (
                  <Badge
                    key={d.typeCode}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => navigate(`/types/${d.typeCode}`)}
                  >
                    {d.typeCode} {d.typeName} ({d.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* 80 Type Distribution */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              80タイプ分布（全タイプ）
            </CardTitle>
          </CardHeader>
          <CardContent>
            {typeDistributionLoading ? (
              <div className="text-sm text-muted-foreground py-8 text-center">読み込み中...</div>
            ) : typeDistribution?.length ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {typeDistribution.map((d, i) => (
                  <HorizontalBar
                    key={d.typeCode}
                    label={d.typeCode}
                    value={d.count}
                    max={maxTypeCount}
                    color={baseTypeColors[i % baseTypeColors.length]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-8 text-center">
                まだ診断データがありません
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conditional Rendering based on mainTab */}
        {mainTab === "stats" && (
          <>
            {/* Results Table */}
            <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                診断結果一覧
              </CardTitle>
              <input
                type="text"
                placeholder="ユーザー名、メール、タイプで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-lg bg-background w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </CardHeader>
          <CardContent>
            {resultsLoading ? (
              <div className="text-sm text-muted-foreground py-8 text-center">読み込み中...</div>
            ) : filteredResults.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                {searchQuery ? "検索結果がありません" : "まだ診断データがありません"}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2.5 px-3 font-medium text-muted-foreground">ユーザー</th>
                        <th className="py-2.5 px-3 font-medium text-muted-foreground">タイプ</th>
                        <th className="py-2.5 px-3 font-medium text-muted-foreground">Base</th>
                        <th className="py-2.5 px-3 font-medium text-muted-foreground">Layer</th>
                        <th className="py-2.5 px-3 font-medium text-muted-foreground">Power</th>
                        <th className="py-2.5 px-3 font-medium text-muted-foreground">Shift</th>
                        <th className="py-2.5 px-3 font-medium text-muted-foreground">日時</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((r) => (
                        <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3">
                            <div>
                              <div className="font-medium text-foreground">{r.userName ?? "名前なし"}</div>
                              <div className="text-xs text-muted-foreground">{r.userEmail ?? "-"}</div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => navigate(`/types/${r.typeCode}`)}
                              className="text-left hover:text-primary transition-colors"
                            >
                              <div className="font-medium">{r.typeCode}</div>
                              <div className="text-xs text-muted-foreground">{r.typeName}</div>
                            </button>
                          </td>
                          <td className="py-2.5 px-3">
                            <Badge variant="outline" className="text-xs">{r.baseType}</Badge>
                          </td>
                          <td className="py-2.5 px-3">
                            <Badge variant="secondary" className="text-xs">
                              L{r.cognitiveLayer}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-mono">{Math.round(r.processingPower)}%</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-mono">{Math.round(r.dynamicShift)}%</span>
                          </td>
                          <td className="py-2.5 px-3 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(r.createdAt).toLocaleString("ja-JP", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    ページ {page + 1} ({filteredResults.length}件表示)
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      前へ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!results || results.length < PAGE_SIZE}
                      onClick={() => setPage((p) => p + 1)}
                      className="gap-1"
                    >
                      次へ
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
          </>
        )}

        {/* Pattern Management Tab */}
        {mainTab === "patterns" && (
          <>
            <div className="mb-6 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMainTab("stats")}
                className="gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                統計に戻る
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Layer Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cognitive Layer パターン</CardTitle>
                </CardHeader>
                <CardContent>
                  {layerPatterns && layerPatterns.length > 0 ? (
                    <div className="space-y-2">
                      {layerPatterns.map((pattern, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                          <div className="font-medium mb-1">パターン {pattern.patternIndex}</div>
                          <div className="text-xs text-muted-foreground">
                            {Array.isArray(pattern.questions) ? `${pattern.questions.length}問` : "データ形式エラー"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">パターンがまだ生成されていません</p>
                  )}
                </CardContent>
              </Card>

              {/* Power Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Processing Power パターン</CardTitle>
                </CardHeader>
                <CardContent>
                  {powerPatterns && powerPatterns.length > 0 ? (
                    <div className="space-y-2">
                      {powerPatterns.map((pattern, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                          <div className="font-medium mb-1">パターン {pattern.patternIndex}</div>
                          <div className="text-xs text-muted-foreground">
                            {Array.isArray(pattern.questions) ? `${pattern.questions.length}問` : "データ形式エラー"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">パターンがまだ生成されていません</p>
                  )}
                </CardContent>
              </Card>

              {/* Shift Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dynamic Shift パターン</CardTitle>
                </CardHeader>
                <CardContent>
                  {shiftPatterns && shiftPatterns.length > 0 ? (
                    <div className="space-y-2">
                      {shiftPatterns.map((pattern, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                          <div className="font-medium mb-1">パターン {pattern.patternIndex}</div>
                          <div className="text-xs text-muted-foreground">
                            {Array.isArray(pattern.questions) ? `${pattern.questions.length}シナリオ` : "データ形式エラー"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">パターンがまだ生成されていません</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
