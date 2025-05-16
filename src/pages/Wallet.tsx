
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, QrCode, RefreshCw, Send } from "lucide-react";
import WalletCard from "@/components/WalletCard";
import TransactionHistory from "@/components/TransactionHistory";
import MintDialog from "@/components/modals/MintDialog";
import RedeemDialog from "@/components/modals/RedeemDialog";
import SendDialog from "@/components/modals/SendDialog";
import ReceiveDialog from "@/components/modals/ReceiveDialog";
import { useToast } from "@/hooks/use-toast";
import { walletService } from "@/services/walletService";
import { useAuth } from "@/contexts/AuthContext";

const Wallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<"mint" | "redeem" | "send" | "receive" | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    if (user) {
      try {
        setLoading(true);
        const walletData = await walletService.getUserWallet();
        setWallet(walletData);
      } catch (error) {
        console.error("Error fetching wallet:", error);
        toast({
          title: "Error",
          description: "Failed to load wallet data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopyAddress = () => {
    if (wallet?.public_key) {
      navigator.clipboard.writeText(wallet.public_key);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleAction = (action: "mint" | "redeem" | "send" | "receive") => {
    setActiveModal(action);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <DashboardLayout>
      <div className="container section-padding">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <WalletCard />
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              <Button 
                variant="outline" 
                className="flex gap-2" 
                onClick={() => handleAction("send")}
              >
                <Send className="h-4 w-4" /> Send
              </Button>
              <Button 
                variant="outline" 
                className="flex gap-2" 
                onClick={() => handleAction("receive")}
              >
                <QrCode className="h-4 w-4" /> Receive
              </Button>
              <Button 
                variant="outline" 
                className="flex gap-2" 
                onClick={() => handleAction("mint")}
              >
                <ExternalLink className="h-4 w-4" /> Mint
              </Button>
              <Button 
                variant="outline" 
                className="flex gap-2" 
                onClick={() => handleAction("redeem")}
              >
                <ExternalLink className="h-4 w-4 rotate-180" /> Redeem
              </Button>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Wallet Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="text-sm bg-muted p-3 rounded-md break-all">
                    {wallet?.public_key || "Loading wallet address..."}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex gap-2 w-full" 
                    onClick={handleCopyAddress}
                  >
                    <Copy className="h-4 w-4" /> Copy Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your recent IDRS transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionHistory limit={5} />
          </CardContent>
        </Card>
      </div>
      
      {/* Modals */}
      <MintDialog 
        isOpen={activeModal === "mint"} 
        onClose={closeModal} 
        walletBalance={wallet?.balance}
      />
      
      <RedeemDialog 
        isOpen={activeModal === "redeem"} 
        onClose={closeModal} 
        walletBalance={wallet?.balance}
      />
      
      <SendDialog 
        isOpen={activeModal === "send"} 
        onClose={closeModal} 
        walletBalance={wallet?.balance}
      />
      
      <ReceiveDialog 
        isOpen={activeModal === "receive"} 
        onClose={closeModal} 
        walletPublicKey={wallet?.public_key}
      />
    </DashboardLayout>
  );
};

export default Wallet;
