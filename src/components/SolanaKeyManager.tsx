
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Copy, Download, Eye, EyeOff, Info } from "lucide-react";
import { toast } from "sonner";
import crypto from 'crypto-js';

interface SolanaKeyManagerProps {
  walletData: {
    public_key: string;
    encrypted_private_key: string;
  };
}

const SolanaKeyManager = ({ walletData }: SolanaKeyManagerProps) => {
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAttempting, setIsAttempting] = useState(false);

  // Decrypt the private key using the user's password
  const decryptPrivateKey = async (encryptedData: string, password: string, email: string) => {
    try {
      setIsAttempting(true);
      
      // Generate the same encryption key used during wallet creation
      const encryptionKey = crypto.SHA256(email + password).toString();
      
      // Parse the encrypted data
      const { iv, data } = JSON.parse(encryptedData);
      
      // TODO: Implement actual decryption logic
      // For now, we'll just simulate it since we can't directly use the WebCrypto API here
      
      // Simulate successful decryption
      setTimeout(() => {
        // Simulated private key (this would be the actual decrypted key in a real implementation)
        const simulatedPrivateKey = "5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe7BFkkR7uUfvxTdg3";
        setPrivateKey(simulatedPrivateKey);
        setIsAttempting(false);
        toast.success("Private key decrypted");
      }, 1000);
      
    } catch (error) {
      console.error("Error decrypting private key:", error);
      toast.error("Failed to decrypt private key. Incorrect password.");
      setIsAttempting(false);
    }
  };
  
  // Copy the private key to clipboard
  const copyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      toast.success("Private key copied to clipboard");
    }
  };
  
  // Download private key as a text file
  const downloadPrivateKey = () => {
    if (privateKey) {
      const element = document.createElement("a");
      const file = new Blob([privateKey], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "solana_private_key.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Private key downloaded");
    }
  };
  
  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setPrivateKey(null);
    setPassword("");
    setShowPrivateKey(false);
    setIsAttempting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Solana Wallet Keys</CardTitle>
        <CardDescription>
          Securely manage your Solana wallet private key
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Public Key</p>
            <div className="flex items-center">
              <code className="bg-muted p-2 rounded text-sm font-mono truncate flex-1">
                {walletData.public_key}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(walletData.public_key);
                  toast.success("Public key copied to clipboard");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Private Key Access</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Keep your private key secure. Anyone with access to your private key can control your funds.
              Never share your private key with others.
            </AlertDescription>
          </Alert>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-rupiah-blue">
                Access Private Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Access Private Key</DialogTitle>
                <DialogDescription>
                  Enter your password to decrypt and access your private key. This is sensitive information.
                </DialogDescription>
              </DialogHeader>
              
              {!privateKey ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isAttempting}
                    />
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700 text-xs">
                      This is the same password you used when signing up.
                    </AlertDescription>
                  </Alert>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={handleDialogClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => decryptPrivateKey(walletData.encrypted_private_key, password, "user@example.com")}
                      disabled={!password || isAttempting}
                    >
                      {isAttempting ? "Decrypting..." : "Decrypt Private Key"}
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="privateKey" className="text-sm font-medium">
                        Private Key
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        className="h-8 px-2"
                      >
                        {showPrivateKey ? (
                          <EyeOff className="h-4 w-4 mr-1" />
                        ) : (
                          <Eye className="h-4 w-4 mr-1" />
                        )}
                        {showPrivateKey ? "Hide" : "Show"}
                      </Button>
                    </div>
                    <div className="bg-muted p-3 rounded">
                      <code className="text-xs font-mono break-all">
                        {showPrivateKey ? privateKey : "•".repeat(64)}
                      </code>
                    </div>
                  </div>
                  
                  <Alert className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700 text-xs">
                      Never share this key with anyone. Store it securely. Anyone with access to this key
                      has complete control over your wallet.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex space-x-2">
                    <Button onClick={copyPrivateKey} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                    <Button onClick={downloadPrivateKey} className="flex-1">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={handleDialogClose}>
                      Close
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SolanaKeyManager;
