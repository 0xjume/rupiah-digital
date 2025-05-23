
import { useState } from "react";
import { ArrowRight, Coins, Send, Upload, Download, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WalletCard from "@/components/WalletCard";
import TransactionHistory from "@/components/TransactionHistory";
import RecentActivity from "@/components/RecentActivity";

type OverviewTabProps = {
  onAction: (action: "mint" | "redeem" | "send" | "receive") => void;
};

const OverviewTab = ({ onAction }: OverviewTabProps) => {
  const [enablePrivateTransfers, setEnablePrivateTransfers] = useState(true);
  
  const togglePrivateTransfers = () => {
    setEnablePrivateTransfers(!enablePrivateTransfers);
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
              <TransactionHistory limit={5} />
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
