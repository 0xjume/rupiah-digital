
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { walletService } from "@/services/walletService";
import { useAuth } from "@/contexts/AuthContext";

// Import refactored components
import OverviewTab from "@/components/dashboard/OverviewTab";
import WalletTab from "@/components/dashboard/WalletTab";
import MintDialog from "@/components/modals/MintDialog";
import RedeemDialog from "@/components/modals/RedeemDialog";
import SendDialog from "@/components/modals/SendDialog";
import ReceiveDialog from "@/components/modals/ReceiveDialog";

const Dashboard = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeModal, setActiveModal] = useState<"mint" | "redeem" | "send" | "receive" | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchWalletData = async () => {
      if (user) {
        try {
          const walletData = await walletService.getUserWallet();
          if (walletData) {
            setWallet(walletData);
          }
        } catch (error) {
          console.error("Error fetching wallet:", error);
        }
      }
    };
    
    fetchWalletData();
  }, [user]);
  
  const handleAction = (action: "mint" | "redeem" | "send" | "receive") => {
    setActiveModal(action);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };
  
  return (
    <DashboardLayout>
      <div className="container section-padding">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview">
            <OverviewTab onAction={handleAction} />
          </TabsContent>
          
          <TabsContent value="wallet">
            <WalletTab wallet={wallet} />
          </TabsContent>
        </Tabs>
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

export default Dashboard;
