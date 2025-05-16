
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

// Form schema
const mintFormSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

type MintDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  walletBalance?: number;
};

const MintDialog = ({ isOpen, onClose, walletBalance }: MintDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  
  const mintForm = useForm<z.infer<typeof mintFormSchema>>({
    resolver: zodResolver(mintFormSchema),
    defaultValues: {
      amount: "",
      paymentMethod: "",
    },
  });
  
  const handleMint = async (values: z.infer<typeof mintFormSchema>) => {
    try {
      setLoading(true);
      
      // Process mint through the treasury service
      const result = await treasuryService.processMint(
        Number(values.amount),
        values.paymentMethod
      );
      
      // Show payment link if available
      if (result?.payment?.paymentLink) {
        setPaymentLink(result.payment.paymentLink);
        toast.success(`Mint transaction initiated for ${values.amount} IDRS`);
      } else {
        // Close the dialog if we don't have a payment link
        toast.success(`Mint transaction initiated for ${values.amount} IDRS. Check your email for payment instructions.`);
        onClose();
        mintForm.reset();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process mint request");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePayment = () => {
    setPaymentLink(null);
    onClose();
    mintForm.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        {paymentLink ? (
          <>
            <DialogHeader>
              <DialogTitle>Complete your Payment</DialogTitle>
              <DialogDescription>
                Please complete the payment to continue with minting IDRS tokens.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-center text-sm text-muted-foreground">
                Click the button below to open the payment page in a new tab.
                After completing your payment, return to this window.
              </p>
              <Button
                onClick={() => window.open(paymentLink, "_blank")}
                className="w-full"
              >
                Go to Payment Page
              </Button>
              <p className="text-xs text-muted-foreground">
                Note: It may take a few minutes for your payment to be processed after completion.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClosePayment}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Mint IDRS</DialogTitle>
              <DialogDescription>
                Convert Indonesian Rupiah (IDR) to IDRS tokens at a 1:1 ratio.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...mintForm}>
              <form onSubmit={mintForm.handleSubmit(handleMint)} className="space-y-4">
                <FormField
                  control={mintForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (IDR)</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} type="number" min="0" />
                      </FormControl>
                      <FormDescription>
                        Minimum amount: 50,000 IDR
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={mintForm.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select payment method</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="e_wallet">E-Wallet</option>
                          <option value="credit_card">Credit Card</option>
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
                    Proceed
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

export default MintDialog;
