
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
import { QRCodeSVG } from "qrcode.react";
import { Spinner } from "@/components/ui/spinner";

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
            {walletPublicKey ? (
              <div className="w-48 h-48 bg-white p-3 rounded">
                <QRCodeSVG 
                  value={walletPublicKey}
                  size={186}
                  level="H"
                  includeMargin={false}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-white p-3 rounded flex items-center justify-center">
                <Spinner className="h-8 w-8 text-rupiah-blue" />
              </div>
            )}
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
          <Button onClick={handleReceive} className="bg-rupiah-blue text-white hover:bg-rupiah-blue/90">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveDialog;
