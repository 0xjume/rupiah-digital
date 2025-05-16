
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ReceiveDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  walletPublicKey?: string;
};

const ReceiveDialog = ({ isOpen, onClose, walletPublicKey }: ReceiveDialogProps) => {
  const handleReceive = () => {
    if (walletPublicKey) {
      navigator.clipboard.writeText(walletPublicKey);
    }
    toast.success("Your wallet address has been copied to clipboard");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Receive IDRS</DialogTitle>
          <DialogDescription>
            Share your wallet address to receive IDRS tokens.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-6 rounded-lg flex items-center justify-center">
            <div className="w-48 h-48 bg-white p-3 rounded">
              {/* Placeholder for QR code */}
              <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <p className="text-center text-sm text-muted-foreground">QR Code for your wallet address</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Your Wallet Address</Label>
            <div className="flex">
              <Input 
                id="walletAddress" 
                value={walletPublicKey || "No wallet address"} 
                readOnly 
                className="flex-1"
              />
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={() => {
                  if (walletPublicKey) {
                    navigator.clipboard.writeText(walletPublicKey);
                    toast.success("Address copied to clipboard");
                  }
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Only send IDRS tokens or other Solana tokens to this address. Sending other types of tokens may result in permanent loss.
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={handleReceive}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveDialog;
