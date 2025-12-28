import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Upload, X, User, Heart, ArrowRight, Loader2, ChevronLeft, Image, Edit3 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import MatchResults from "@/components/MatchResults";

interface ChartData {
  chartId?: number;
  personName: string;
  gender: "male" | "female" | "";
  nakshatra: number | null;
  nakshatraPada: number;
  rashi: number | null;
  imageUrl?: string;
  imageFile?: File;
  imagePreview?: string;
  extracted?: boolean;
  extracting?: boolean;
  confidence?: number;
}

const initialChartData: ChartData = {
  personName: "",
  gender: "",
  nakshatra: null,
  nakshatraPada: 1,
  rashi: null,
};

export default function Match() {
  const [, setLocation] = useLocation();
  const [chart1, setChart1] = useState<ChartData>({ ...initialChartData });
  const [chart2, setChart2] = useState<ChartData>({ ...initialChartData });
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");
  const [matchResult, setMatchResult] = useState<any>(null);
  const [isMatching, setIsMatching] = useState(false);

  const { data: nakshatras } = trpc.reference.nakshatras.useQuery();
  const { data: rashis } = trpc.reference.rashis.useQuery();

  const processImageMutation = trpc.horoscope.processImage.useMutation({
    onError: (error) => {
      toast.error("Failed to process image: " + error.message);
    },
  });

  const calculateMatchMutation = trpc.matching.calculate.useMutation({
    onSuccess: (data) => {
      setMatchResult(data);
      setIsMatching(false);
    },
    onError: (error) => {
      toast.error("Failed to calculate match: " + error.message);
      setIsMatching(false);
    },
  });

  const handleFileDrop = useCallback(async (
    e: React.DragEvent<HTMLDivElement>,
    chartSetter: React.Dispatch<React.SetStateAction<ChartData>>,
    chartNum: 1 | 2
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await processImage(file, chartSetter, chartNum);
    }
  }, []);

  const handleFileSelect = useCallback(async (
    e: React.ChangeEvent<HTMLInputElement>,
    chartSetter: React.Dispatch<React.SetStateAction<ChartData>>,
    chartNum: 1 | 2
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImage(file, chartSetter, chartNum);
    }
  }, []);

  const processImage = async (
    file: File,
    chartSetter: React.Dispatch<React.SetStateAction<ChartData>>,
    chartNum: 1 | 2
  ) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      const preview = e.target?.result as string;

      chartSetter((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: preview,
        extracting: true,
      }));

      try {
        const result = await processImageMutation.mutateAsync({
          imageBase64: base64,
          mimeType: file.type,
        });

        chartSetter((prev) => ({
          ...prev,
          chartId: result.chartId,
          imageUrl: result.imageUrl,
          nakshatra: result.extracted.nakshatra || null,
          nakshatraPada: result.extracted.nakshatraPada || 1,
          rashi: result.extracted.rashi || null,
          personName: result.extracted.personName || prev.personName,
          gender: result.extracted.gender || prev.gender,
          extracted: true,
          extracting: false,
          confidence: result.extracted.confidence,
        }));

        if (result.extracted.confidence && result.extracted.confidence > 50) {
          toast.success(`Chart ${chartNum} processed successfully!`);
        } else {
          toast.info(`Chart ${chartNum} processed. Please verify the extracted data.`);
        }
      } catch (error) {
        chartSetter((prev) => ({
          ...prev,
          extracting: false,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const clearChart = (chartSetter: React.Dispatch<React.SetStateAction<ChartData>>) => {
    chartSetter({ ...initialChartData });
  };

  const canCalculate = () => {
    const chart1Valid = chart1.gender && chart1.nakshatra && chart1.rashi;
    const chart2Valid = chart2.gender && chart2.nakshatra && chart2.rashi;
    return chart1Valid && chart2Valid;
  };

  const handleCalculate = () => {
    if (!canCalculate()) {
      toast.error("Please fill in all required fields for both charts");
      return;
    }

    setIsMatching(true);
    calculateMatchMutation.mutate({
      chart1: {
        chartId: chart1.chartId,
        personName: chart1.personName || "Person 1",
        gender: chart1.gender as "male" | "female",
        nakshatra: chart1.nakshatra!,
        nakshatraPada: chart1.nakshatraPada,
        rashi: chart1.rashi!,
      },
      chart2: {
        chartId: chart2.chartId,
        personName: chart2.personName || "Person 2",
        gender: chart2.gender as "male" | "female",
        nakshatra: chart2.nakshatra!,
        nakshatraPada: chart2.nakshatraPada,
        rashi: chart2.rashi!,
      },
      saveResult: false,
    });
  };

  const resetMatch = () => {
    setMatchResult(null);
    setChart1({ ...initialChartData });
    setChart2({ ...initialChartData });
  };

  if (matchResult) {
    return <MatchResults result={matchResult} onReset={resetMatch} />;
  }

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="container flex items-center h-16">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold gradient-text">Porondam.ai</span>
            </Link>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Horoscope Matching</span>
            </h1>
            <p className="text-muted-foreground">
              Upload two horoscope charts or enter details manually
            </p>
          </div>

          {/* Input Method Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upload" | "manual")} className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Upload Charts
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Manual Entry
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Charts Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Chart 1 */}
            <ChartInput
              title="First Person"
              chart={chart1}
              setChart={setChart1}
              chartNum={1}
              activeTab={activeTab}
              nakshatras={nakshatras || []}
              rashis={rashis || []}
              onFileDrop={handleFileDrop}
              onFileSelect={handleFileSelect}
              onClear={() => clearChart(setChart1)}
            />

            {/* Chart 2 */}
            <ChartInput
              title="Second Person"
              chart={chart2}
              setChart={setChart2}
              chartNum={2}
              activeTab={activeTab}
              nakshatras={nakshatras || []}
              rashis={rashis || []}
              onFileDrop={handleFileDrop}
              onFileSelect={handleFileSelect}
              onClear={() => clearChart(setChart2)}
            />
          </div>

          {/* Calculate Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="gradient-primary text-white border-0 text-lg px-12 py-6 h-auto"
              onClick={handleCalculate}
              disabled={!canCalculate() || isMatching}
            >
              {isMatching ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Heart className="mr-2 w-5 h-5" />
                  Calculate Compatibility
                </>
              )}
            </Button>
            
            {!canCalculate() && (
              <p className="text-sm text-muted-foreground mt-4">
                Please provide gender, nakshatra, and rashi for both persons
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface ChartInputProps {
  title: string;
  chart: ChartData;
  setChart: React.Dispatch<React.SetStateAction<ChartData>>;
  chartNum: 1 | 2;
  activeTab: "upload" | "manual";
  nakshatras: Array<{ id: number; name: string; sinhala: string }>;
  rashis: Array<{ id: number; name: string; sinhala: string; english: string }>;
  onFileDrop: (e: React.DragEvent<HTMLDivElement>, setter: React.Dispatch<React.SetStateAction<ChartData>>, num: 1 | 2) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<ChartData>>, num: 1 | 2) => void;
  onClear: () => void;
}

function ChartInput({
  title,
  chart,
  setChart,
  chartNum,
  activeTab,
  nakshatras,
  rashis,
  onFileDrop,
  onFileSelect,
  onClear,
}: ChartInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className={`${chartNum === 1 ? "gradient-primary" : "gradient-gold"} text-white`}>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-white/80">
          {activeTab === "upload" ? "Upload horoscope chart image" : "Enter birth details manually"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Name Input */}
        <div>
          <Label htmlFor={`name-${chartNum}`}>Name (Optional)</Label>
          <Input
            id={`name-${chartNum}`}
            placeholder="Enter name"
            value={chart.personName}
            onChange={(e) => setChart((prev) => ({ ...prev, personName: e.target.value }))}
          />
        </div>

        {/* Gender Select */}
        <div>
          <Label>Gender *</Label>
          <Select
            value={chart.gender}
            onValueChange={(v) => setChart((prev) => ({ ...prev, gender: v as "male" | "female" }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male / පුරුෂ</SelectItem>
              <SelectItem value="female">Female / ස්ත්‍රී</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeTab === "upload" && (
          <>
            {/* Upload Area */}
            {!chart.imagePreview ? (
              <div
                className={`dropzone ${isDragging ? "active" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { setIsDragging(false); onFileDrop(e, setChart, chartNum); }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">
                  Drag & drop horoscope chart image
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFileSelect(e, setChart, chartNum)}
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={chart.imagePreview}
                  alt="Horoscope chart"
                  className="w-full h-48 object-cover rounded-lg"
                />
                {chart.extracting && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Analyzing chart...</p>
                    </div>
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={onClear}
                >
                  <X className="w-4 h-4" />
                </Button>
                {chart.confidence !== undefined && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Confidence: {chart.confidence}%
                  </div>
                )}
              </div>
            )}

            {chart.extracted && (
              <Alert>
                <Sparkles className="w-4 h-4" />
                <AlertDescription>
                  Data extracted from image. Please verify and correct if needed.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* Nakshatra Select */}
        <div>
          <Label>Nakshatra (Birth Star) * <span className="sinhala text-xs">නැකත</span></Label>
          <Select
            value={chart.nakshatra?.toString() || ""}
            onValueChange={(v) => setChart((prev) => ({ ...prev, nakshatra: parseInt(v) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select nakshatra" />
            </SelectTrigger>
            <SelectContent>
              {nakshatras.map((n) => (
                <SelectItem key={n.id} value={n.id.toString()}>
                  {n.id}. {n.name} <span className="sinhala">({n.sinhala})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nakshatra Pada */}
        <div>
          <Label>Nakshatra Pada (Quarter) <span className="sinhala text-xs">පාදය</span></Label>
          <Select
            value={chart.nakshatraPada.toString()}
            onValueChange={(v) => setChart((prev) => ({ ...prev, nakshatraPada: parseInt(v) }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Pada</SelectItem>
              <SelectItem value="2">2nd Pada</SelectItem>
              <SelectItem value="3">3rd Pada</SelectItem>
              <SelectItem value="4">4th Pada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rashi Select */}
        <div>
          <Label>Rashi (Moon Sign) * <span className="sinhala text-xs">රාශිය</span></Label>
          <Select
            value={chart.rashi?.toString() || ""}
            onValueChange={(v) => setChart((prev) => ({ ...prev, rashi: parseInt(v) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rashi" />
            </SelectTrigger>
            <SelectContent>
              {rashis.map((r) => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  {r.id}. {r.name} ({r.english}) <span className="sinhala">({r.sinhala})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
