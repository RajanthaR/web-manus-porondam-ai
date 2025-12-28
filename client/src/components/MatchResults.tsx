import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  RefreshCw, 
  Download, 
  Share2, 
  Check, 
  X, 
  Info,
  ChevronLeft,
  Sparkles,
  Star,
  AlertTriangle
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PorondamScore {
  name: string;
  nameSinhala: string;
  maxPoints: number;
  score: number;
  matched: boolean;
  description: string;
  descriptionSinhala: string;
}

interface MatchResultData {
  resultId?: number;
  overallScore: number;
  matchedCount: number;
  totalAspects: number;
  porondamScores: Record<string, PorondamScore>;
  recommendations: {
    english: string;
    sinhala: string;
  };
  chart1Info: {
    personName?: string;
    gender: string;
    nakshatra: number;
    nakshatraName: { english: string; sinhala: string } | null;
    rashi: number;
    rashiName: { sanskrit: string; english: string; sinhala: string } | null;
  };
  chart2Info: {
    personName?: string;
    gender: string;
    nakshatra: number;
    nakshatraName: { english: string; sinhala: string } | null;
    rashi: number;
    rashiName: { sanskrit: string; english: string; sinhala: string } | null;
  };
  compatibility: string;
  compatibilitySinhala: string;
}

interface MatchResultsProps {
  result: MatchResultData;
  onReset: () => void;
}

export default function MatchResults({ result, onReset }: MatchResultsProps) {
  const [language, setLanguage] = useState<"english" | "sinhala">("english");

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-[var(--success)]";
    if (score >= 50) return "text-[var(--warning)]";
    if (score >= 30) return "text-orange-500";
    return "text-destructive";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return "bg-[var(--success)]/10";
    if (score >= 50) return "bg-[var(--warning)]/10";
    if (score >= 30) return "bg-orange-500/10";
    return "bg-destructive/10";
  };

  const getBarClass = (score: number, maxPoints: number) => {
    const percentage = (score / maxPoints) * 100;
    if (percentage >= 75) return "matched";
    if (percentage >= 25) return "partial";
    return "unmatched";
  };

  // Sort porondam scores by importance (max points)
  const sortedScores = Object.entries(result.porondamScores).sort(
    ([, a], [, b]) => b.maxPoints - a.maxPoints
  );

  // Calculate total points
  const totalScore = Object.values(result.porondamScores).reduce((sum, s) => sum + s.score, 0);
  const maxTotalScore = Object.values(result.porondamScores).reduce((sum, s) => sum + s.maxPoints, 0);

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Button variant="ghost" onClick={onReset} className="flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            <span>New Match</span>
          </Button>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text hidden sm:block">Porondam.ai</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === "english" ? "sinhala" : "english")}>
              {language === "english" ? "සිංහල" : "English"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Score Overview */}
          <Card className="border-0 shadow-xl mb-8 overflow-hidden">
            <div className="gradient-primary p-8 text-white text-center">
              <h1 className="text-2xl font-bold mb-6">
                {language === "english" ? "Compatibility Results" : "ගැලපීම් ප්‍රතිඵල"}
              </h1>
              
              {/* Main Score Circle */}
              <div className="score-circle mx-auto bg-white/10 backdrop-blur mb-6">
                <div className="text-center">
                  <span className="text-5xl font-bold">{result.overallScore}%</span>
                </div>
              </div>
              
              <Badge 
                variant="secondary" 
                className={`text-lg px-4 py-1 ${getScoreBgColor(result.overallScore)} ${getScoreColor(result.overallScore)} border-0`}
              >
                {language === "english" ? result.compatibility : result.compatibilitySinhala}
                {language === "english" ? " Match" : " ගැලපීම"}
              </Badge>
              
              <p className="mt-4 text-white/80">
                {result.matchedCount} {language === "english" ? "of" : "න්"} {result.totalAspects} {language === "english" ? "aspects matched" : "අංශ ගැලපේ"}
                <span className="mx-2">•</span>
                {totalScore}/{maxTotalScore} {language === "english" ? "points" : "ලකුණු"}
              </p>
            </div>
            
            {/* Person Info */}
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-lg bg-accent/50">
                  <div className="w-12 h-12 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {result.chart1Info.gender === "male" ? "♂" : "♀"}
                    </span>
                  </div>
                  <h3 className="font-semibold">{result.chart1Info.personName || "Person 1"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.chart1Info.nakshatraName?.english} 
                    <span className="sinhala"> ({result.chart1Info.nakshatraName?.sinhala})</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.chart1Info.rashiName?.english}
                    <span className="sinhala"> ({result.chart1Info.rashiName?.sinhala})</span>
                  </p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-accent/50">
                  <div className="w-12 h-12 rounded-full gradient-gold mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {result.chart2Info.gender === "male" ? "♂" : "♀"}
                    </span>
                  </div>
                  <h3 className="font-semibold">{result.chart2Info.personName || "Person 2"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.chart2Info.nakshatraName?.english}
                    <span className="sinhala"> ({result.chart2Info.nakshatraName?.sinhala})</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.chart2Info.rashiName?.english}
                    <span className="sinhala"> ({result.chart2Info.rashiName?.sinhala})</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[var(--gold)]" />
                {language === "english" ? "Recommendations" : "නිර්දේශ"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={language === "sinhala" ? "sinhala" : ""}>
                {language === "english" ? result.recommendations.english : result.recommendations.sinhala}
              </p>
            </CardContent>
          </Card>

          {/* Detailed Scores */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                {language === "english" ? "Detailed Analysis" : "සවිස්තරාත්මක විශ්ලේෂණය"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedScores.map(([key, score]) => (
                <div key={key} className="p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">
                          {language === "english" ? score.name : score.nameSinhala}
                        </h4>
                        {score.matched ? (
                          <Check className="w-4 h-4 text-[var(--success)]" />
                        ) : score.score > 0 ? (
                          <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                        ) : (
                          <X className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                      <p className={`text-sm text-muted-foreground mt-1 ${language === "sinhala" ? "sinhala" : ""}`}>
                        {language === "english" ? score.description : score.descriptionSinhala}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <span className={`text-lg font-bold ${score.matched ? "text-[var(--success)]" : score.score > 0 ? "text-[var(--warning)]" : "text-destructive"}`}>
                        {score.score}/{score.maxPoints}
                      </span>
                    </div>
                  </div>
                  <div className="porondam-bar">
                    <div 
                      className={`porondam-bar-fill ${getBarClass(score.score, score.maxPoints)}`}
                      style={{ width: `${(score.score / score.maxPoints) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button onClick={onReset} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              {language === "english" ? "New Match" : "නව ගැලපීම"}
            </Button>
            <Link href="/learn">
              <Button variant="outline" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                {language === "english" ? "Learn More" : "තව දැනගන්න"}
              </Button>
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            {language === "english" 
              ? "This analysis is for informational purposes only. Please consult a qualified astrologer for important life decisions."
              : "මෙම විශ්ලේෂණය තොරතුරු අරමුණු සඳහා පමණි. වැදගත් ජීවිත තීරණ සඳහා සුදුසුකම් ලත් ජ්‍යෝතිෂ්‍යවේදියෙකුගෙන් උපදෙස් ලබා ගන්න."}
          </p>
        </div>
      </main>
    </div>
  );
}
