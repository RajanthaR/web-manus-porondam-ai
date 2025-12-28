import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Heart, 
  History, 
  User, 
  LogOut, 
  Plus,
  Calendar,
  Trash2,
  Eye,
  ChevronLeft
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: matchHistory, refetch: refetchHistory } = trpc.matching.history.useQuery(undefined, {
    enabled: !!user,
  });

  const deleteResultMutation = trpc.matching.deleteResult.useMutation({
    onSuccess: () => {
      toast.success("Match result deleted");
      refetchHistory();
    },
    onError: (error) => {
      toast.error("Failed to delete: " + error.message);
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation("/");
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-[var(--success)]";
    if (score >= 50) return "bg-[var(--warning)]";
    if (score >= 30) return "bg-orange-500";
    return "bg-destructive";
  };

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Home</span>
          </Link>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">Porondam.ai</span>
          </Link>
          
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {user.name || "User"}!</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Link href="/match">
              <Card className="border-0 shadow-lg card-hover cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">New Match</h3>
                    <p className="text-sm text-muted-foreground">Start a new horoscope compatibility check</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/learn">
              <Card className="border-0 shadow-lg card-hover cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full gradient-gold flex items-center justify-center shrink-0">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Learn Porondam</h3>
                    <p className="text-sm text-muted-foreground">Understand the 20 matching aspects</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Match History */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Your Match History
              </CardTitle>
              <CardDescription>
                View and manage your previous compatibility checks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!matchHistory || matchHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No match history yet</p>
                  <Link href="/match">
                    <Button className="gradient-primary text-white border-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Start Your First Match
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchHistory.map((item) => (
                    <div 
                      key={item.match.id} 
                      className="p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full ${getScoreColor(Number(item.match.overallScore))} flex items-center justify-center text-white font-bold`}>
                            {Math.round(Number(item.match.overallScore))}%
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {item.chart1Name || "Person 1"} & {item.chart2Name || "Person 2"}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(item.match.createdAt), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={Number(item.match.overallScore) >= 50 ? "default" : "secondary"}>
                            {Number(item.match.overallScore) >= 70 ? "Excellent" : 
                             Number(item.match.overallScore) >= 50 ? "Good" : 
                             Number(item.match.overallScore) >= 30 ? "Moderate" : "Challenging"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteResultMutation.mutate({ resultId: item.match.id })}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
