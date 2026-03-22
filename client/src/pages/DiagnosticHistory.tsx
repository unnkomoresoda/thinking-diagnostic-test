import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Layers, Zap, Shuffle, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function DiagnosticHistory() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const { data: results, isLoading } = trpc.diagnostic.history.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">ログインが必要です</h2>
          <p className="text-muted-foreground text-sm mb-6">
            診断履歴を閲覧するにはログインしてください。
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              トップに戻る
            </Button>
            <Button onClick={() => { window.location.href = getLoginUrl(); }}>
              ログイン
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">診断履歴</h1>
            <p className="text-sm text-muted-foreground">{user?.name}さんの過去の診断結果</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-sm animate-pulse">
                <CardContent className="p-6 h-24" />
              </Card>
            ))}
          </div>
        ) : !results || results.length === 0 ? (
          <div className="text-center py-16">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">まだ診断履歴がありません</p>
            <p className="text-muted-foreground text-sm mb-6">
              診断テストを受けて、あなたの思考の設計図を作成しましょう。
            </p>
            <Button onClick={() => navigate("/")}>診断を始める</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((r) => (
              <Card
                key={r.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/result/${r.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{r.typeName}</h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {r.typeCode}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(r.createdAt).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <MiniStat icon={<Brain className="w-3.5 h-3.5" />} label={r.baseType} />
                        <MiniStat icon={<Layers className="w-3.5 h-3.5" />} label={`L${r.cognitiveLayer}`} />
                        <MiniStat icon={<Zap className="w-3.5 h-3.5" />} label={`${r.processingPower}pt`} />
                        <MiniStat icon={<Shuffle className="w-3.5 h-3.5" />} label={`${r.dynamicShift}pt`} />
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
  );
}
