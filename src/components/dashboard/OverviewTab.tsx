
import { useState, useEffect } from "react";
import { ArrowRight, Coins, Send, Upload, Download, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WalletCard from "@/components/WalletCard";
import TransactionHistory from "@/components/TransactionHistory";
import RecentActivity from "@/components/RecentActivity";
import { transactionService } from "@/services/transactionService";
import { Transaction } from "@/components/TransactionHistory";
import { toast } from "sonner";

type OverviewTabProps = {
  onAction: (action: "mint" | "redeem" | "send" | "receive") => void;
};

const OverviewTab = ({ onAction }: OverviewTabProps) => {
  const [enablePrivateTransfers, setEnablePrivateTransfers] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const togglePrivateTransfers = () => {
    setEnablePrivateTransfers(!enablePrivateTransfers);
    // In a real app, we would persist this setting
    toast.success(`Private transfers ${!enablePrivateTransfers ? 'enabled' : 'disabled'}`);
  };
  
  useEffect(() => {
    fetchTransactions();
    
    // Set up an interval to refresh transactions every 2 minutes
    const intervalId = setInterval(() => {
      fetchTransactions(false); // Don't show loading state on auto-refresh
    }, 120000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchTransactions = async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      console.log("Fetching transactions...");
      const data = await transactionService.getTransactions(5);
      console.log("Transactions fetched:", data);
      
      if (data && Array.isArray(data)) {
        setTransactions(data as Transaction[]);
        setError(null);
      } else {
        console.error("Invalid transaction data format:", data);
        if (transactions.length === 0) {
          setError("Received invalid transaction data");
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err);
      
      // Only set error if we don't already have transactions
      if (transactions.length === 0) {
        // Show different error messages based on error type
        if (err.message && err.message.includes("auth")) {
          setError("Authentication error. Please sign in again.");
        } else if (err.message && err.message.includes("network")) {
          setError("Network error. Please check your connection.");
        } else {
          setError(err.message || "Failed to load transactions");
        }
        
        // For serious errors, show a toast
        if (showLoading) {
          toast.error("Could not load transaction history");
        }
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  
  const handleRefresh = () => {
    fetchTransactions();
  };
  
  return (
    <div className="space-y-0">
      <div className="grid gap-6 md:grid-cols-7">
        {/* Main content area */}
        <div className="md:col-span-5 space-y-6">
          <WalletCard />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your IDRS tokens with these common actions
              </CardDescription>
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  className="flex flex-col items-center h-auto py-6 bg-rupiah-blue text-white hover:bg-white hover:text-rupiah-blue hover:border hover:border-rupiah-blue transition-colors"
                  onClick={() => onAction("mint")}
                >
                  <Coins className="h-8 w-8 mb-2" />
                  <span>Mint</span>
                </Button>
                <Button 
                  className="flex flex-col items-center h-auto py-6 bg-rupiah-blue text-white hover:bg-white hover:text-rupiah-blue hover:border hover:border-rupiah-blue transition-colors"
                  onClick={() => onAction("redeem")}
                >
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Redeem</span>
                </Button>
                <Button 
                  className="flex flex-col items-center h-auto py-6 bg-rupiah-blue text-white hover:bg-white hover:text-rupiah-blue hover:border hover:border-rupiah-blue transition-colors"
                  onClick={() => onAction("send")}
                >
                  <Send className="h-8 w-8 mb-2" />
                  <span>Send</span>
                </Button>
                <Button 
                  className="flex flex-col items-center h-auto py-6 bg-rupiah-blue text-white hover:bg-white hover:text-rupiah-blue hover:border hover:border-rupiah-blue transition-colors"
                  onClick={() => onAction("receive")}
                >
                  <Download className="h-8 w-8 mb-2" />
                  <span>Receive</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle>Transaction History</CardTitle>
              <Button variant="link" className="text-rupiah-red flex items-center">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <TransactionHistory 
                limit={5} 
                transactions={transactions} 
                loading={loading} 
                error={error} 
                onRefresh={handleRefresh} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Reserve Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">100%</div>
              <p className="text-sm text-muted-foreground mb-4">
                Each IDRS token is backed 1:1 by IDR
              </p>
              <div className="rounded-lg bg-muted p-2">
                <p className="text-xs">Last audit: May 1, 2025</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RecentActivity />
            </CardContent>
            <CardFooter className="border-t pt-3">
              <Button variant="outline" size="sm" className="w-full">
                View all activity
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-rupiah-blue text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  <span className="text-sm">Confidential Transfers</span>
                </div>
                <div 
                  className={`flex items-center h-5 w-11 rounded-full ${enablePrivateTransfers ? 'bg-rupiah-red' : 'bg-gray-600'} relative cursor-pointer`}
                  onClick={togglePrivateTransfers}
                >
                  <div className={`absolute h-4 w-4 rounded-full bg-white transition-all ${enablePrivateTransfers ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
              <p className="text-xs mt-2 text-white/70">
                Hide transaction amounts while maintaining auditability
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
