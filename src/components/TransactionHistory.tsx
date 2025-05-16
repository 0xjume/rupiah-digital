
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { transactionService } from "@/services/transactionService";
import { ParsedTransaction } from "@/services/solanaRpcService";

export interface Transaction extends ParsedTransaction {
  wallet_id?: string;
  created_at: string;
}

interface TransactionHistoryProps {
  limit?: number;
}

const TransactionHistory = ({ limit }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactions(limit);
      setTransactions(data as Transaction[]);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err);
      setError(err.message || "Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };
  
  const refreshTransactions = async () => {
    try {
      setRefreshing(true);
      const data = await transactionService.getTransactions(limit);
      setTransactions(data as Transaction[]);
      setError(null);
    } catch (err: any) {
      console.error("Failed to refresh transactions:", err);
      setError(err.message || "Failed to refresh transactions");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    
    // Set up polling to refresh transaction data every 60 seconds
    const intervalId = setInterval(() => {
      refreshTransactions();
    }, 60000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [limit]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowRight className="mr-2 h-4 w-4 text-rupiah-red" />;
      case "receive":
        return <ArrowLeft className="mr-2 h-4 w-4 text-green-500" />;
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="h-8 w-8 text-rupiah-blue" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="mb-4">{error}</p>
        <Button onClick={fetchTransactions} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
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
      
      {transactions.length > 0 ? (
        transactions.map((tx) => (
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
          No transactions yet
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
