
import { z } from "zod";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { transactionService } from "@/services/transactionService";

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
  const sendForm = useForm<z.infer<typeof sendFormSchema>>({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      amount: "",
      recipient: "",
      isPrivate: false,
    },
  });
  
  const handleSend = async (values: z.infer<typeof sendFormSchema>) => {
    try {
      // Create a send transaction
      await transactionService.createTransaction(
        'send',
        Number(values.amount),
        values.isPrivate,
        values.recipient
      );
      
      toast.success(`Initiated transfer of ${values.amount} IDRS to ${values.recipient}`);
      onClose();
      sendForm.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to process send request");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
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
                    <FormLabel className="text-base">Private Transaction</FormLabel>
                    <FormDescription>
                      Hide transaction amount from public view
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Send</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SendDialog;
