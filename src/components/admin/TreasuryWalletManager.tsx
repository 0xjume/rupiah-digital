
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { treasuryService, TreasuryWallet } from "@/services/treasuryService";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ExternalLink } from "lucide-react";

const TreasuryWalletManager = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [treasuryWallet, setTreasuryWallet] = useState<TreasuryWallet | null>(null);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  
  useEffect(() => {
    fetchTreasuryWallet();
  }, []);
  
  const fetchTreasuryWallet = async () => {
    try {
      setLoading(true);
      const wallet = await treasuryService.getTreasuryWallet();
      setTreasuryWallet(wallet);
    } catch (error) {
      console.error("Error fetching treasury wallet:", error);
      toast.error("Failed to fetch treasury wallet");
    } finally {
      setLoading(false);
    }
  };
  
  const initializeTreasuryWallet = async () => {
    try {
      setUpdating(true);
      await treasuryService.initializeTreasuryWallet();
      toast.success("Treasury wallet initialized successfully");
      fetchTreasuryWallet();
    } catch (error) {
      console.error("Error initializing treasury wallet:", error);
      toast.error("Failed to initialize treasury wallet");
    } finally {
      setUpdating(false);
    }
  };
  
  const updateTreasuryWallet = async () => {
    try {
      if (!publicKey || !privateKey) {
        toast.error("Both public key and private key are required");
        return;
      }
      
      setUpdating(true);
      await treasuryService.updateTreasuryWallet(publicKey, privateKey);
      toast.success("Treasury wallet updated successfully");
      fetchTreasuryWallet();
      setPublicKey("");
      setPrivateKey("");
    } catch (error) {
      console.error("Error updating treasury wallet:", error);
      toast.error("Failed to update treasury wallet");
    } finally {
      setUpdating(false);
    }
  };
  
  const viewOnExplorer = (address: string) => {
    window.open(`https://explorer.solana.com/address/${address}?cluster=devnet`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treasury Wallet Management</CardTitle>
        <CardDescription>
          Manage your Treasury wallet for IDRS token operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        ) : treasuryWallet ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Active Treasury Wallet</h3>
              <Badge variant="outline" className="bg-green-500/10 text-green-600">Active</Badge>
            </div>
            
            <div className="grid gap-2">
              <div>
                <Label>Public Key</Label>
                <div className="flex items-center mt-1">
                  <code className="text-sm bg-muted p-2 rounded flex-1 overflow-x-auto">
                    {treasuryWallet.public_key}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => viewOnExplorer(treasuryWallet.public_key)}
                    className="ml-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>Balance</Label>
                <div className="text-sm bg-muted p-2 rounded mt-1">
                  {treasuryWallet.balance.toLocaleString()} IDRS
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={fetchTreasuryWallet}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground mb-4">No active Treasury wallet found</p>
            <Button onClick={initializeTreasuryWallet} disabled={updating}>
              {updating && <Spinner className="mr-2 h-4 w-4" />}
              Initialize Treasury Wallet
            </Button>
          </div>
        )}
        
        <div className="border-t mt-6 pt-6">
          <h3 className="text-lg font-medium mb-4">Update Treasury Wallet</h3>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="publicKey">Solana Public Key</Label>
              <Input 
                id="publicKey" 
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="Enter Solana public key"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="privateKey">Solana Private Key</Label>
              <Input 
                id="privateKey" 
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                type="password"
                placeholder="Enter Solana private key or seed phrase"
              />
              <p className="text-xs text-muted-foreground">
                Private keys are encrypted before storage. Never share your private key with anyone.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={updateTreasuryWallet} disabled={updating || !publicKey || !privateKey}>
          {updating && <Spinner className="mr-2 h-4 w-4" />}
          Update Treasury Wallet
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TreasuryWalletManager;
