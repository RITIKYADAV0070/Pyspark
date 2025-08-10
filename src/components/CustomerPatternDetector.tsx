import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  ArrowUp, 
  Database,
  CheckCircle,
  Timer,
  AlertCircle
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  merchantId: string;
  merchantName: string;
  totalTransactions: number;
  avgWeight: number;
  percentileRank: number;
  weightPercentile: number;
  actionType: string;
  detectionTime: string;
}

interface MerchantStats {
  id: string;
  name: string;
  totalTransactions: number;
  eligibleForUpgrade: boolean;
  topCustomers: number;
  upgradesCandidates: number;
}

const CustomerPatternDetector = () => {
  const [merchants, setMerchants] = useState<MerchantStats[]>([]);
  const [detectedPatterns, setDetectedPatterns] = useState<Customer[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [totalDetections, setTotalDetections] = useState(0);

  // Mock data generation
  const generateMockData = () => {
    const merchantNames = ["TechCorp Bank", "Global Finance", "Metro Credit", "Digital Pay", "Swift Banking"];
    
    const mockMerchants: MerchantStats[] = merchantNames.map((name, index) => ({
      id: `M${index + 1}`,
      name,
      totalTransactions: Math.floor(Math.random() * 100000) + 30000,
      eligibleForUpgrade: false,
      topCustomers: Math.floor(Math.random() * 500) + 100,
      upgradesCandidates: 0
    }));

    // Calculate eligibility and candidates
    mockMerchants.forEach(merchant => {
      merchant.eligibleForUpgrade = merchant.totalTransactions > 50000;
      if (merchant.eligibleForUpgrade) {
        merchant.upgradesCandidates = Math.floor(Math.random() * 15) + 5;
      }
    });

    return mockMerchants;
  };

  const generatePatternDetections = (merchants: MerchantStats[]) => {
    const patterns: Customer[] = [];
    
    merchants.forEach(merchant => {
      if (merchant.eligibleForUpgrade) {
        for (let i = 0; i < merchant.upgradesCandidates; i++) {
          patterns.push({
            id: `C${merchant.id}_${i + 1}`,
            name: `Customer ${Math.floor(Math.random() * 9999)}`,
            merchantId: merchant.id,
            merchantName: merchant.name,
            totalTransactions: Math.floor(Math.random() * 200) + 150, // High transaction count
            avgWeight: Math.random() * 0.2 + 0.05, // Bottom 10% weight (0.05-0.25)
            percentileRank: Math.random() * 10 + 90, // Top 10% for transactions
            weightPercentile: Math.random() * 10, // Bottom 10% for weight
            actionType: "UPGRADE",
            detectionTime: new Date().toLocaleString()
          });
        }
      }
    });

    return patterns.sort((a, b) => b.totalTransactions - a.totalTransactions);
  };

  const runPatternDetection = async () => {
    setIsAnalyzing(true);
    setDetectedPatterns([]);
    setTotalDetections(0);

    // Simulate real-time detection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMerchants = generateMockData();
    setMerchants(newMerchants);

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const patterns = generatePatternDetections(newMerchants);
    
    // Simulate streaming detection results
    for (let i = 0; i < patterns.length; i += 5) {
      const batch = patterns.slice(0, i + 5);
      setDetectedPatterns(batch);
      setTotalDetections(batch.length);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsAnalyzing(false);
  };

  useEffect(() => {
    // Auto-run on component mount
    runPatternDetection();
  }, []);

  const getWeightColor = (weight: number) => {
    if (weight < 0.15) return "text-destructive";
    if (weight < 0.3) return "text-warning";
    return "text-success";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            PatId1: Customer Upgrade Pattern Detection
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Identifying high-transaction, low-weight customers for merchant upgrade programs
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runPatternDetection}
              disabled={isAnalyzing}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              {isAnalyzing ? (
                <>
                  <Timer className="h-4 w-4 mr-2 animate-spin" />
                  Detecting Patterns...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Run Pattern Detection
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary">
                {totalDetections} Patterns Detected
              </Badge>
            </div>
          </div>

          {/* Pattern Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Top 10%</div>
              <div className="text-sm text-muted-foreground">Transaction Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">Bottom 10%</div>
              <div className="text-sm text-muted-foreground">Customer Weight</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">50K+</div>
              <div className="text-sm text-muted-foreground">Merchant Transactions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Merchant Overview */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Merchant Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {merchants.map((merchant) => (
              <div key={merchant.id} className="p-4 border border-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{merchant.name}</h4>
                  {merchant.eligibleForUpgrade ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Transactions:</span>
                    <span className="font-medium">{merchant.totalTransactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upgrade Candidates:</span>
                    <span className="font-medium text-primary">{merchant.upgradesCandidates}</span>
                  </div>
                </div>
                <Progress 
                  value={Math.min(100, (merchant.totalTransactions / 100000) * 100)} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detection Results */}
      {detectedPatterns.length > 0 && (
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-success" />
              Upgrade Candidates Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {detectedPatterns.map((customer) => (
                <div key={customer.id} className="p-4 border border-border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{customer.name}</h4>
                      <p className="text-sm text-muted-foreground">{customer.merchantName}</p>
                    </div>
                    <Badge className="bg-success text-success-foreground">
                      {customer.actionType}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Transactions:</span>
                      <div className="font-semibold text-success">{customer.totalTransactions}</div>
                      <div className="text-xs text-success">Top {(100 - customer.percentileRank).toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Weight:</span>
                      <div className={`font-semibold ${getWeightColor(customer.avgWeight)}`}>
                        {customer.avgWeight.toFixed(3)}
                      </div>
                      <div className="text-xs text-destructive">Bottom {customer.weightPercentile.toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Merchant:</span>
                      <div className="font-semibold">{customer.merchantId}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Detected:</span>
                      <div className="text-xs">{customer.detectionTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerPatternDetector;