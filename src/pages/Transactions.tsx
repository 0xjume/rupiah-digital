
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { transactionService } from "@/services/transactionService";
import { Transaction } from "@/components/TransactionHistory";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactions(20);
      setTransactions(data as Transaction[]);
      
      // Check if this is mock data
      setIsMockData(data.some(tx => tx.id.toString().startsWith('mock')));
      
      setError(null);
      
      // Apply initial filtering based on active tab
      filterTransactionsByType(data as Transaction[]);
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err);
      setError(err.message || "Failed to load transactions");
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async () => {
    try {
      setRefreshing(true);
      const data = await transactionService.getTransactions(20);
      setTransactions(data as Transaction[]);
      
      // Check if this is mock data
      setIsMockData(data.some(tx => tx.id.toString().startsWith('mock')));
      
      // Apply filtering on refresh
      filterTransactionsByType(data as Transaction[]);
      setError(null);
    } catch (err: any) {
      console.error("Failed to refresh transactions:", err);
      setError(err.message || "Failed to refresh transactions");
    } finally {
      setRefreshing(false);
    }
  };
  
  // Filter transactions based on type and search query
  const filterTransactionsByType = (transactionsToFilter: Transaction[]) => {
    let filtered = transactionsToFilter;
    
    // Apply type filter if not "all"
    if (activeTab !== "all") {
      filtered = filtered.filter(tx => tx.type === activeTab.toLowerCase());
    }
    
    // Apply search query if present
    if (searchQuery) {
      filtered = filtered.filter(tx => 
        (tx.id && tx.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.signature && tx.signature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredTransactions(filtered);
  };
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterTransactionsByType(transactions);
  };

  useEffect(() => {
    // Fetch transactions when component mounts
    fetchTransactions();
    
    // Set up polling to refresh transaction data every 60 seconds
    const intervalId = setInterval(() => {
      refreshTransactions();
    }, 60000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // When tab changes, reapply filters
  useEffect(() => {
    filterTransactionsByType(transactions);
  }, [activeTab]);
  
  // When search query changes, reapply filters
  useEffect(() => {
    filterTransactionsByType(transactions);
  }, [searchQuery]);
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowRight className="mr-2 h-4 w-4 text-rupiah-red" />;
      case "receive":
        return <ArrowLeft className="mr-2 h-4 w-4 text-green-500" />;
      case "swap":
        return <RefreshCw className="mr-2 h-4 w-4 text-blue-500" />;
      case "mint":
        return <Badge variant="outline" className="mr-2 bg-purple-500/10 text-purple-700 border-purple-500/30">Mint</Badge>;
      case "redeem":
        return <Badge variant="outline" className="mr-2 bg-orange-500/10 text-orange-700 border-orange-500/30">Redeem</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-700 border-red-500/30">Failed</Badge>;
      default:
        return null;
    }
  };
  
  const formatAddress = (address?: string) => {
    if (!address) return "";
    if (address.length <= 10) return address;
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="container section-padding">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Transactions</h1>
          
          <div className="w-full md:w-auto flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by transaction ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-full md:w-64"
            />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View all your IDRS transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="send">Sent</TabsTrigger>
                <TabsTrigger value="receive">Received</TabsTrigger>
                <TabsTrigger value="swap">Swaps</TabsTrigger>
                <TabsTrigger value="mint">Mints</TabsTrigger>
                <TabsTrigger value="redeem">Redeems</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      {isMockData && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          Demo Data
                        </Badge>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={refreshTransactions} 
                      disabled={refreshing}
                      className="text-sm flex items-center gap-1"
                    >
                      {refreshing ? <Spinner className="h-3 w-3 mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                      Refresh
                    </Button>
                  </div>
                  
                  {isMockData && (
                    <Alert className="bg-blue-50 text-blue-800 mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Showing sample transaction data. Real blockchain transactions will appear here once you have activity.
                      </AlertDescription>
                    </Alert>
                  )}

                  {loading && !refreshing ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner className="h-8 w-8 text-rupiah-blue" />
                    </div>
                  ) : error && filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-red-500">
                      <p className="mb-4">{error}</p>
                      <Button onClick={fetchTransactions} variant="outline">Try Again</Button>
                    </div>
                  ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <div key={tx.id || tx.signature} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/20 transition-colors cursor-pointer">
                        <div className="flex items-center">
                          {getTransactionIcon(tx.type)}
                          <div>
                            <div className="font-medium">
                              {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                              {tx.isPrivate && (
                                <Badge variant="outline" className="ml-2 text-xs py-0">
                                  Private
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(tx.created_at)} • {
                                tx.type === "send" ? 
                                  formatAddress(tx.recipientAddress) : 
                                  tx.type === "receive" ? 
                                    formatAddress(tx.senderAddress) :
                                    tx.type === "swap" ? 
                                      "SOL to IDRS" :
                                      tx.type === "redeem" ?
                                        "BCA ****4567" : "IDRS Mint"
                              }
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium">
                            {tx.type === "send" || tx.type === "redeem" ? "-" : "+"}
                            {tx.amount?.toLocaleString() || "0"} IDRS
                          </div>
                          <div className="mt-1">{getStatusBadge(tx.status)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
