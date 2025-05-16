
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import WalletCard from "@/components/WalletCard";
import SolanaKeyManager from "@/components/SolanaKeyManager";

type WalletTabProps = {
  wallet: any;
};

const WalletTab = ({ wallet }: WalletTabProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <WalletCard />
        
        <Card>
          <CardHeader>
            <CardTitle>Wallet Details</CardTitle>
            <CardDescription>View and manage your wallet information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Wallet Type</h4>
              <p className="text-sm flex items-center">
                <Badge className="mr-2">Solana</Badge>
                Solana-based IDRS wallet on Devnet
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Creation Date</h4>
              <p className="text-sm">{wallet?.created_at ? new Date(wallet.created_at).toLocaleDateString() : "Unknown"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Network</h4>
              <p className="text-sm flex items-center">
                <Badge variant="outline" className="mr-2">Devnet</Badge>
                Solana Devnet
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        {wallet?.public_key && wallet?.encrypted_private_key && (
          <SolanaKeyManager walletData={{
            public_key: wallet.public_key,
            encrypted_private_key: wallet.encrypted_private_key
          }} />
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Wallet Security</CardTitle>
            <CardDescription>Manage your wallet security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Transaction PIN</h4>
                <p className="text-sm text-muted-foreground">Require PIN for all transactions</p>
              </div>
              <Button variant="outline">Set PIN</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Recovery Options</h4>
                <p className="text-sm text-muted-foreground">Configure wallet recovery methods</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletTab;
