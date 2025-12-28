import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Upload, Heart, BookOpen, ArrowRight, Star, Users, Shield } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Porondam.ai</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Learn
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="default" className="gradient-primary text-white border-0">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="default" className="gradient-primary text-white border-0">
                  Sign In
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm mb-6 fade-in">
              <Star className="w-4 h-4 text-[var(--gold)]" />
              <span>AI-Powered Horoscope Matching</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="gradient-text">Instant Porondam</span>
              <br />
              <span className="text-foreground">Compatibility Check</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto fade-in" style={{ animationDelay: "0.2s" }}>
              Upload photos of handwritten horoscope charts and get instant compatibility analysis using traditional 
              <span className="sinhala"> විසි පොරොන්දම්</span> (20 Porondam) matching system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{ animationDelay: "0.3s" }}>
              <Link href="/match">
                <Button size="lg" className="gradient-primary text-white border-0 text-lg px-8 py-6 h-auto">
                  Start Matching
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto bg-white/50">
                  <BookOpen className="mr-2 w-5 h-5" />
                  Learn About Porondam
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your horoscope compatibility results in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="card-hover border-0 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">1. Upload Charts</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Upload photos of two handwritten horoscope charts. Our AI recognizes Sinhala text and extracts birth details.
              </CardContent>
            </Card>
            
            <Card className="card-hover border-0 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full gradient-gold mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">2. AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Our system calculates all 20 Porondam aspects using traditional Vedic astrology algorithms.
              </CardContent>
            </Card>
            
            <Card className="card-hover border-0 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 rounded-full bg-[var(--success)] mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">3. Get Results</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Receive detailed compatibility scores with explanations in both English and Sinhala.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why Choose <span className="gradient-text">Porondam.ai</span>?
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Free Pre-Screening</h3>
                    <p className="text-muted-foreground">
                      Save money by checking compatibility before visiting an astrologer. Get instant results without waiting days.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI-Powered Accuracy</h3>
                    <p className="text-muted-foreground">
                      Advanced image recognition extracts data from handwritten charts with high accuracy.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Traditional Methods</h3>
                    <p className="text-muted-foreground">
                      Uses authentic 20 Porondam system followed by Sri Lankan astrologers for generations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="border-0 shadow-2xl overflow-hidden">
                <CardHeader className="gradient-primary text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Sample Compatibility Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="score-circle mx-auto bg-white">
                      <div className="text-center">
                        <span className="text-4xl font-bold gradient-text">72%</span>
                        <p className="text-sm text-muted-foreground">Match Score</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Gana Porondam</span>
                        <span className="text-[var(--success)]">6/6</span>
                      </div>
                      <div className="porondam-bar">
                        <div className="porondam-bar-fill matched" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Nadi Porondam</span>
                        <span className="text-[var(--success)]">8/8</span>
                      </div>
                      <div className="porondam-bar">
                        <div className="porondam-bar-fill matched" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Yoni Porondam</span>
                        <span className="text-[var(--warning)]">2/4</span>
                      </div>
                      <div className="porondam-bar">
                        <div className="porondam-bar-fill partial" style={{ width: "50%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Check Your Compatibility?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Upload your horoscope charts now and get instant results. No registration required for basic matching.
          </p>
          <Link href="/match">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
              Start Free Matching
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-white/80">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Porondam.ai</span>
              </div>
              <p className="text-sm">
                AI-powered horoscope matching for Sri Lankan families. Making traditional astrology accessible to everyone.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/match" className="hover:text-white transition-colors">Horoscope Matching</Link></li>
                <li><Link href="/learn" className="hover:text-white transition-colors">Learn Porondam</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/learn" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/learn" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Language</h4>
              <p className="text-sm sinhala">සිංහල භාෂාවෙන් ද ලබා ගත හැක</p>
              <p className="text-sm mt-1">Available in Sinhala</p>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm">
            <p>© 2024 Porondam.ai. All rights reserved.</p>
            <p className="mt-1 text-white/60">
              This tool is for informational purposes only. Please consult a qualified astrologer for important decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
