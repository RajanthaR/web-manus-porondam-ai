import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  BookOpen, 
  Star, 
  Heart, 
  ChevronLeft,
  Moon,
  Sun,
  Users,
  Shield,
  Zap,
  Activity
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Learn() {
  const [language, setLanguage] = useState<"english" | "sinhala">("english");
  const { data: porondamInfo } = trpc.reference.porondamInfo.useQuery();
  const { data: nakshatras } = trpc.reference.nakshatras.useQuery();
  const { data: rashis } = trpc.reference.rashis.useQuery();

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">Porondam.ai</span>
          </Link>
          
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === "english" ? "sinhala" : "english")}>
            {language === "english" ? "සිංහල" : "English"}
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm mb-4">
              <BookOpen className="w-4 h-4" />
              <span>{language === "english" ? "Educational Guide" : "අධ්‍යාපනික මාර්ගෝපදේශය"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {language === "english" ? (
                <>Understanding the <span className="gradient-text">20 Porondam</span> System</>
              ) : (
                <span className="sinhala gradient-text">විසි පොරොන්දම් ක්‍රමය අවබෝධ කර ගැනීම</span>
              )}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === "english" 
                ? "Learn about the traditional Sri Lankan horoscope matching system used for marriage compatibility."
                : <span className="sinhala">විවාහ ගැලපීම සඳහා භාවිතා කරන සාම්ප්‍රදායික ශ්‍රී ලාංකික කේන්දර ගැලපීම් ක්‍රමය ගැන ඉගෙන ගන්න.</span>}
            </p>
          </div>

          {/* Introduction */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader className="gradient-primary text-white">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                {language === "english" ? "What is Porondam?" : <span className="sinhala">පොරොන්දම යනු කුමක්ද?</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className={`text-lg leading-relaxed ${language === "sinhala" ? "sinhala" : ""}`}>
                {language === "english" 
                  ? porondamInfo?.description
                  : porondamInfo?.descriptionSinhala}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
                  <Moon className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">
                      {language === "english" ? "Nakshatra (Birth Star)" : <span className="sinhala">නැකත (උපන් තරුව)</span>}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === "english" 
                        ? "The lunar mansion where the Moon was positioned at birth"
                        : <span className="sinhala">උපත් අවස්ථාවේ චන්ද්‍රයා පිහිටි චන්ද්‍ර මාලිගාව</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
                  <Sun className="w-6 h-6 text-[var(--gold)] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">
                      {language === "english" ? "Rashi (Moon Sign)" : <span className="sinhala">රාශිය (චන්ද්‍ර රාශිය)</span>}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === "english" 
                        ? "The zodiac sign where the Moon was positioned at birth"
                        : <span className="sinhala">උපත් අවස්ථාවේ චන්ද්‍රයා පිහිටි රාශි චක්‍රය</span>}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs defaultValue="aspects" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aspects">
                {language === "english" ? "20 Aspects" : <span className="sinhala">අංශ 20</span>}
              </TabsTrigger>
              <TabsTrigger value="nakshatras">
                {language === "english" ? "27 Nakshatras" : <span className="sinhala">නැකත් 27</span>}
              </TabsTrigger>
              <TabsTrigger value="rashis">
                {language === "english" ? "12 Rashis" : <span className="sinhala">රාශි 12</span>}
              </TabsTrigger>
            </TabsList>

            {/* 20 Aspects */}
            <TabsContent value="aspects">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>
                    {language === "english" ? "The 20 Porondam Aspects" : <span className="sinhala">විසි පොරොන්දම් අංශ</span>}
                  </CardTitle>
                  <CardDescription>
                    {language === "english" 
                      ? "Each aspect examines a different dimension of compatibility"
                      : <span className="sinhala">සෑම අංශයක්ම ගැලපීමේ විවිධ මාන පරීක්ෂා කරයි</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {porondamInfo?.aspects.map((aspect, index) => (
                      <AccordionItem key={index} value={`aspect-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                              {aspect.maxPoints}
                            </Badge>
                            <span className={language === "sinhala" ? "sinhala" : ""}>
                              {language === "english" ? aspect.name : aspect.nameSinhala}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className={`text-muted-foreground ${language === "sinhala" ? "sinhala" : ""}`}>
                            {language === "english" ? aspect.description : aspect.descriptionSinhala}
                          </p>
                          <p className="text-sm mt-2">
                            <span className="font-medium">{language === "english" ? "Maximum Points:" : <span className="sinhala">උපරිම ලකුණු:</span>}</span> {aspect.maxPoints}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 27 Nakshatras */}
            <TabsContent value="nakshatras">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>
                    {language === "english" ? "The 27 Nakshatras" : <span className="sinhala">නැකත් 27</span>}
                  </CardTitle>
                  <CardDescription>
                    {language === "english" 
                      ? "Lunar mansions used in Vedic astrology"
                      : <span className="sinhala">වේද ජ්‍යෝතිෂ්‍යයේ භාවිතා වන චන්ද්‍ර මාලිගා</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {nakshatras?.map((nak) => (
                      <div key={nak.id} className="p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">
                            {nak.id}
                          </Badge>
                          <div>
                            <p className="font-medium">{nak.name}</p>
                            <p className="text-sm text-muted-foreground sinhala">{nak.sinhala}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">{nak.gana}</Badge>
                          <Badge variant="secondary" className="text-xs">{nak.yoni}</Badge>
                          <Badge variant="secondary" className="text-xs">{nak.nadi}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 12 Rashis */}
            <TabsContent value="rashis">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>
                    {language === "english" ? "The 12 Rashis (Zodiac Signs)" : <span className="sinhala">රාශි 12 (රාශි චක්‍ර ලකුණු)</span>}
                  </CardTitle>
                  <CardDescription>
                    {language === "english" 
                      ? "The twelve zodiac signs in Vedic astrology"
                      : <span className="sinhala">වේද ජ්‍යෝතිෂ්‍යයේ රාශි චක්‍ර ලකුණු දොළහ</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rashis?.map((rashi) => (
                      <div key={rashi.id} className="p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                            {rashi.id}
                          </div>
                          <div>
                            <p className="font-semibold">{rashi.name}</p>
                            <p className="text-sm text-muted-foreground">{rashi.english}</p>
                            <p className="text-sm text-muted-foreground sinhala">{rashi.sinhala}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {language === "english" ? "Lord:" : <span className="sinhala">අධිපති:</span>} {rashi.lord}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Scoring Guide */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                {language === "english" ? "Scoring Guide" : <span className="sinhala">ලකුණු මාර්ගෝපදේශය</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20">
                  <div className="text-2xl font-bold text-[var(--success)]">70%+</div>
                  <div className="font-medium">
                    {language === "english" 
                      ? porondamInfo?.scoringGuide.excellent.label 
                      : porondamInfo?.scoringGuide.excellent.labelSinhala}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "english" 
                      ? "Highly compatible, excellent prospects"
                      : <span className="sinhala">ඉතා ගැලපේ, විශිෂ්ට අපේක්ෂාවන්</span>}
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/20">
                  <div className="text-2xl font-bold text-[var(--warning)]">50-69%</div>
                  <div className="font-medium">
                    {language === "english" 
                      ? porondamInfo?.scoringGuide.good.label 
                      : porondamInfo?.scoringGuide.good.labelSinhala}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "english" 
                      ? "Good compatibility with minor concerns"
                      : <span className="sinhala">සුළු ගැටළු සහිත හොඳ ගැලපීම</span>}
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="text-2xl font-bold text-orange-500">30-49%</div>
                  <div className="font-medium">
                    {language === "english" 
                      ? porondamInfo?.scoringGuide.moderate.label 
                      : porondamInfo?.scoringGuide.moderate.labelSinhala}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "english" 
                      ? "Some challenges, remedies may help"
                      : <span className="sinhala">සමහර අභියෝග, පිළියම් උපකාරී විය හැක</span>}
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="text-2xl font-bold text-destructive">0-29%</div>
                  <div className="font-medium">
                    {language === "english" 
                      ? porondamInfo?.scoringGuide.challenging.label 
                      : porondamInfo?.scoringGuide.challenging.labelSinhala}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "english" 
                      ? "Significant challenges, consult astrologer"
                      : <span className="sinhala">සැලකිය යුතු අභියෝග, ජ්‍යෝතිෂ්‍යවේදියෙකුගෙන් උපදෙස් ගන්න</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Link href="/match">
              <Button size="lg" className="gradient-primary text-white border-0">
                <Heart className="mr-2 w-5 h-5" />
                {language === "english" ? "Try Horoscope Matching" : <span className="sinhala">කේන්දර ගැලපීම උත්සාහ කරන්න</span>}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
