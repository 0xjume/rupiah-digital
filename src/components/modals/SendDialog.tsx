
import { z } from "zod";
import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { transactionService } from "@/services/transactionService";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Form schema
const sendFormSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  recipient: z.string().min(1, "Recipient address is required"),
  isPrivate: z.boolean().default(false),
});

type SendDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  walletBalance?: number;
};

const SendDialog = ({ isOpen, onClose, walletBalance = 0 }: SendDialogProps) => {
  const [sending, setSending] = useState(false);
  const [sendComplete, setSendComplete] = useState(false);

  const sendForm = useForm<z.infer<typeof sendFormSchema>>({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      amount: "",
      recipient: "",
      isPrivate: false,
    },
  });
  
  // Reset the form when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      sendForm.reset();
      setSendComplete(false);
    }
  }, [isOpen, sendForm]);
  
  const handleSend = async (values: z.infer<typeof sendFormSchema>) => {
    try {
      setSending(true);
      
      // Validate amount against wallet balance
      if (Number(values.amount) > (walletBalance || 0)) {
        toast.error(`Insufficient balance. You have ${walletBalance} IDRS available.`);
        setSending(false);
        return;
      }
      
      // Create a send transaction
      await transactionService.createTransaction(
        'send',
        Number(values.amount),
        values.isPrivate,
        values.recipient
      );
      
      // Show success message
      setSendComplete(true);
      toast.success(`Successfully initiated transfer of ${values.amount} IDRS`);
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        onClose();
        sendForm.reset();
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to process send request");
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        {sendComplete ? (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Transfer Initiated</h3>
            <p className="text-center text-muted-foreground">
              Your IDRS tokens are being sent. This may take a moment to process.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Send IDRS</DialogTitle>
              <DialogDescription>
                Transfer IDRS tokens to another wallet address.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...sendForm}>
              <form onSubmit={sendForm.handleSubmit(handleSend)} className="space-y-4">
                <FormField
                  control={sendForm.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Solana address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={sendForm.control}
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
                  control={sendForm.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center">
                          <FormLabel className="text-base">Confidential Transfer</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[220px] text-sm">
                                Hide transaction amount from public view while maintaining auditability with Solana's Confidential Transfer feature
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormDescription>
                          Private transactions are still compliant with regulations
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={onClose} disabled={sending}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={sending} className="bg-rupiah-blue text-white hover:bg-rupiah-blue/90">
                    {sending ? <><Spinner className="mr-2 h-4 w-4" /> Processing...</> : 'Send IDRS'}
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

export default SendDialog;
