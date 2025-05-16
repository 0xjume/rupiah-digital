
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { walletService } from "@/services/walletService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const WalletCard = () => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [wallet, setWallet] = useState<any>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [idrsBalance, setIdrsBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  
  const fetchWalletData = async () => {
    if (user) {
      try {
        setLoading(true);
        const walletData = await walletService.getUserWallet();
        
        if (walletData) {
          setWallet(walletData);
          
          // Set initial balance from the database
          setIdrsBalance(walletData.balance || 0);
          
          // If there's a public key, fetch real-time balances from Solana
          if (walletData.public_key) {
            try {
              // Fetch real-time wallet info from Solana
              const { balance, idrsBalance } = await walletService.getWalletInfo(walletData.public_key);
              setSolBalance(balance);
              setIdrsBalance(idrsBalance);
            } catch (e) {
              console.error("Error fetching Solana balances:", e);
              toast.error("Failed to fetch real-time balance");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching wallet:", error);
        toast.error("Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    }
  };
  
  useEffect(() => {
    fetchWalletData();
    
    // Set up polling to refresh wallet data every 30 seconds
    const intervalId = setInterval(() => {
      if (wallet?.public_key) {
        refreshWalletData();
      }
    }, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [user]);
  
  const refreshWalletData = async () => {
    if (!wallet?.public_key) return;
    
    try {
      setRefreshing(true);
      // Fetch real-time wallet info from Solana
      const { balance, idrsBalance } = await walletService.getWalletInfo(wallet.public_key);
      setSolBalance(balance);
      setIdrsBalance(idrsBalance);
    } catch (e) {
      console.error("Error refreshing balances:", e);
    } finally {
      setRefreshing(false);
    }
  };
  
  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  
  // Function to view wallet on Solana Explorer
  const viewOnExplorer = (publicKey: string) => {
    window.open(`https://explorer.solana.com/address/${publicKey}?cluster=devnet`, '_blank');
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-rupiah-blue to-rupiah-blue/80 text-white">
        <CardHeader>
          <CardTitle className="text-lg text-white/90">Your Wallet</CardTitle>
          <CardDescription className="text-white/70">
            Loading wallet data...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Spinner className="h-8 w-8 text-white" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-rupiah-blue to-rupiah-blue/80 text-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-white/90">Your Wallet</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8"
              onClick={refreshWalletData}
              disabled={refreshing}
            >
              {refreshing ? <Spinner className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              Verified
            </Badge>
          </div>
        </div>
        <CardDescription className="text-white/70">
          Manage and track your $IDRS tokens on Solana
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="text-sm font-medium text-white/70 mb-1">IDRS Balance</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl font-bold mr-2">
                  {isBalanceHidden ? '••••••••' : idrsBalance?.toLocaleString() || '0'}
                </span>
                <span className="text-white/90">IDRS</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={toggleBalanceVisibility}
              >
                {isBalanceHidden ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {solBalance !== null && (
            <div>
              <div className="text-sm font-medium text-white/70 mb-1">SOL Balance</div>
              <div className="flex items-center">
                <span className="text-xl font-medium mr-2">
                  {isBalanceHidden ? '••••••••' : solBalance?.toLocaleString() || '0'}
                </span>
                <span className="text-white/90">SOL</span>
              </div>
            </div>
          )}
          
          <div>
            <div className="text-sm font-medium text-white/70 mb-1">Wallet Address</div>
            <div className="flex items-center justify-between bg-white/10 rounded-md p-3">
              <code className="text-sm font-mono text-white/90 truncate max-w-[200px] sm:max-w-md">
                {wallet?.public_key || "No wallet address"}
              </code>
              {wallet?.public_key && (
                <div className="flex">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => copyToClipboard(wallet.public_key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy address</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => viewOnExplorer(wallet.public_key)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on Explorer</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
            <p className="text-xs mt-2 text-white/60">
              This is your Solana wallet address for IDRS tokens
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
