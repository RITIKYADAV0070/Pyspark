import { useState } from "react";
import CustomerPatternDetector from "./CustomerPatternDetector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Shield, 
  Target, 
  Users, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Database
} from "lucide-react";

interface ScoringCriteria {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  weight: number;
  score: number;
}

const DealScorer = () => {
  const [criteria, setCriteria] = useState<ScoringCriteria[]>([
    {
      id: "financial",
      name: "Financial Impact",
      description: "Revenue potential and profit margins",
      icon: DollarSign,
      weight: 25,
      score: 70
    },
    {
      id: "strategic",
      name: "Strategic Value",
      description: "Alignment with business goals",
      icon: Target,
      weight: 20,
      score: 85
    },
    {
      id: "risk",
      name: "Risk Assessment",
      description: "Market and execution risks",
      icon: Shield,
      weight: 20,
      score: 60
    },
    {
      id: "market",
      name: "Market Opportunity",
      description: "Market size and growth potential",
      icon: TrendingUp,
      weight: 15,
      score: 90
    },
    {
      id: "resources",
      name: "Resource Requirements",
      description: "Team and infrastructure needs",
      icon: Users,
      weight: 10,
      score: 55
    },
    {
      id: "timeline",
      name: "Timeline Feasibility",
      description: "Implementation timeline",
      icon: Clock,
      weight: 10,
      score: 75
    }
  ]);

  const [dealName, setDealName] = useState("Project Alpha");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateScore = (id: string, newScore: number) => {
    setCriteria(prev => 
      prev.map(c => c.id === id ? { ...c, score: newScore } : c)
    );
  };

  const calculateOverallScore = () => {
    const weightedScore = criteria.reduce((total, c) => 
      total + (c.score * c.weight / 100), 0
    );
    return Math.round(weightedScore);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return XCircle;
  };

  const getRecommendation = (score: number) => {
    if (score >= 80) return "Highly Recommended - Proceed with confidence";
    if (score >= 60) return "Proceed with Caution - Address key risks";
    return "Not Recommended - Significant concerns identified";
  };

  const analyzeAI = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Simulate AI analysis with random adjustments
      setCriteria(prev => prev.map(c => ({
        ...c,
        score: Math.max(20, Math.min(100, c.score + (Math.random() - 0.5) * 20))
      })));
      setIsAnalyzing(false);
    }, 2000);
  };

  const overallScore = calculateOverallScore();
  const ScoreIcon = getScoreIcon(overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/5 to-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-primary bg-clip-text text-transparent">
            <h1 className="text-5xl font-bold tracking-tight">Deal Droplet Scorer</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered deal evaluation & customer pattern detection platform
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="scoring" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scoring" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Deal Scoring
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Pattern Detection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scoring" className="space-y-6 mt-6">
            {/* Deal Info & Overall Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-gradient-card shadow-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Deal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Deal Name</label>
                    <input
                      type="text"
                      value={dealName}
                      onChange={(e) => setDealName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <Button 
                    onClick={analyzeAI}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold"
                  >
                    {isAnalyzing ? "Analyzing with AI..." : "🤖 AI-Powered Analysis"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-glow border-primary/20 animate-pulse-glow">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <ScoreIcon className={`h-6 w-6 ${getScoreColor(overallScore)}`} />
                    Overall Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}
                  </div>
                  <Progress value={overallScore} className="h-3" />
                  <Badge 
                    variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "destructive"}
                    className="text-sm"
                  >
                    {getRecommendation(overallScore)}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Scoring Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {criteria.map((criterion) => {
                const Icon = criterion.icon;
                return (
                  <Card key={criterion.id} className="bg-gradient-card shadow-card border-primary/10 hover:shadow-glow transition-all duration-300">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div>{criterion.name}</div>
                          <div className="text-sm font-normal text-muted-foreground">
                            Weight: {criterion.weight}%
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {criterion.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Score</span>
                          <Badge 
                            variant="outline" 
                            className={`${getScoreColor(criterion.score)} border-current`}
                          >
                            {criterion.score}/100
                          </Badge>
                        </div>
                        
                        <Slider
                          value={[criterion.score]}
                          onValueChange={(value) => updateScore(criterion.id, value[0])}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        
                        <Progress 
                          value={criterion.score} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="mt-6">
            <CustomerPatternDetector />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Powered by advanced AI algorithms for intelligent deal evaluation & customer insights
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealScorer;