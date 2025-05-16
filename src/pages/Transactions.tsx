
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import TransactionHistory from "@/components/TransactionHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { transactionService } from "@/services/transactionService";
import { Transaction } from "@/components/TransactionHistory";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (type?: string) => {
    try {
      setLoading(true);
      const transactions = await transactionService.getTransactions(20);
      
      // Filter transactions if a specific type is selected
      if (type && type !== "all") {
        setFilteredTransactions(
          (transactions as Transaction[]).filter(tx => tx.type === type.toLowerCase())
        );
      } else {
        setFilteredTransactions(transactions as Transaction[]);
      }
      
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err);
      setError(err.message || "Failed to load transactions");
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // When tab changes, fetch filtered transactions
    const type = activeTab !== "all" ? activeTab : undefined;
    fetchTransactions(type);
  }, [activeTab]);

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rupiah-blue"></div>
                  </div>
                ) : (
                  <TransactionHistory limit={20} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
