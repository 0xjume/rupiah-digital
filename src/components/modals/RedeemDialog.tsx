
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { transactionService } from "@/services/transactionService";
import { treasuryService } from "@/services/treasuryService";
import { Spinner } from "@/components/ui/spinner";
import { walletService } from "@/services/walletService";
import { useAuth } from "@/contexts/AuthContext";

// Form schema
const redeemFormSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  bankAccount: z.string().min(1, "Bank account is required"),
});

type RedeemDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  walletBalance?: number;
};

const RedeemDialog = ({ isOpen, onClose, walletBalance = 0 }: RedeemDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  
  const redeemForm = useForm<z.infer<typeof redeemFormSchema>>({
    resolver: zodResolver(redeemFormSchema),
    defaultValues: {
      amount: "",
      bankAccount: "",
    },
  });
  
  const handleRedeem = async (values: z.infer<typeof redeemFormSchema>) => {
    try {
      const amount = Number(values.amount);
      
      // Check if requested amount exceeds available balance
      if (amount > (walletBalance || 0)) {
        toast.error(`Insufficient balance. Available: ${walletBalance} IDRS`);
        return;
      }
      
      setLoading(true);
      
      // Get the current user's wallet
      const wallet = await walletService.getUserWallet();
      if (!wallet) {
        toast.error("Wallet not found");
        return;
      }
      
      // Process redeem through the treasury service
      setProcessing(true);
      const result = await treasuryService.processRedeem(
        amount,
        values.bankAccount,
        wallet.id || ""
      );
      
      toast.success(`Redeem of ${values.amount} IDRS initiated successfully. Funds will be transferred to your bank account within 1-2 business days.`);
      onClose();
      redeemForm.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to process redeem request");
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        {processing ? (
          <>
            <DialogHeader>
              <DialogTitle>Processing Redeem Request</DialogTitle>
              <DialogDescription>
                We are processing your redeem request. Please wait...
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-8">
              <Spinner className="h-8 w-8 text-rupiah-red" />
              <p className="text-center text-sm text-muted-foreground">
                This may take a few moments. Do not close this window.
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Redeem IDRS</DialogTitle>
              <DialogDescription>
                Convert your IDRS tokens back to Indonesian Rupiah (IDR).
              </DialogDescription>
            </DialogHeader>
            
            <Form {...redeemForm}>
              <form onSubmit={redeemForm.handleSubmit(handleRedeem)} className="space-y-4">
                <FormField
                  control={redeemForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (IDRS)</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} type="number" min="0" />
                      </FormControl>
                      <FormDescription>
                        Available balance: {walletBalance?.toLocaleString() || '0'} IDRS
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={redeemForm.control}
                  name="bankAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select bank account</option>
                          <option value="bca">BCA ****4567</option>
                          <option value="mandiri">Mandiri ****8901</option>
                          <option value="bni">BNI ****2345</option>
                          <option value="add_new">Add new account...</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Spinner className="mr-2 h-4 w-4" />}
                    Redeem
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RedeemDialog;
