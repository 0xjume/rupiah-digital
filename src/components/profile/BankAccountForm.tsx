
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Plus, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Zod schema for validating Indonesian bank accounts
const bankAccountFormSchema = z.object({
  bank_name: z.string().min(2, { message: "Bank name is required." }),
  account_name: z.string().min(2, { message: "Account holder name is required." }),
  account_number: z.string()
    .min(5, { message: "Account number must be at least 5 digits." })
    .max(20, { message: "Account number is too long." })
    .refine((val) => /^\d+$/.test(val), { message: "Account number must contain only digits." })
});

type BankAccountFormValues = z.infer<typeof bankAccountFormSchema>;

type BankAccount = {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
};

export default function BankAccountForm() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<string | null>(null);
  const { user } = useAuth();

  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountFormSchema),
    defaultValues: {
      bank_name: "",
      account_name: "",
      account_number: ""
    }
  });

  // Fetch user's bank accounts when component mounts
  const fetchBankAccounts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('id, bank_name, account_name, account_number, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure the data matches our BankAccount type
      setBankAccounts(data as BankAccount[] || []);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      toast.error("Failed to load bank accounts");
    }
  };

  // Load bank accounts on component mount
  useEffect(() => {
    fetchBankAccounts();
  }, [user]);

  // Add a new bank account
  const onSubmit = async (values: BankAccountFormValues) => {
    if (!user) {
      toast.error("You must be logged in to add a bank account");
      return;
    }

    setIsLoading(true);
    try {
      // Insert the bank account into the database
      const { error } = await supabase
        .from('bank_accounts')
        .insert({
          bank_name: values.bank_name,
          account_name: values.account_name,
          account_number: values.account_number,
          user_id: user.id
        });

      if (error) throw error;

      // Reset form and refresh bank accounts list
      form.reset();
      toast.success("Bank account added successfully!");
      fetchBankAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to add bank account");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a bank account
  const deleteBankAccount = async (id: string) => {
    setIsLoadingDelete(id);
    try {
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setBankAccounts(bankAccounts.filter(account => account.id !== id));
      toast.success("Bank account removed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove bank account");
    } finally {
      setIsLoadingDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="bank_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Bank Central Asia, Bank Mandiri" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="account_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account holder name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter account number" 
                      {...field} 
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {isLoading ? "Adding..." : "Add Bank Account"}
          </Button>
        </form>
      </Form>

      {/* List of bank accounts */}
      <div className="space-y-2">
        {bankAccounts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No bank accounts added yet.
          </p>
        ) : (
          bankAccounts.map((account) => (
            <div 
              key={account.id} 
              className="flex items-center justify-between p-3 bg-accent/50 rounded-md"
            >
              <div>
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  <p className="font-medium">{account.bank_name}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {account.account_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {account.account_number.replace(/(\d{4})/g, '$1 ').trim()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteBankAccount(account.id)}
                disabled={isLoadingDelete === account.id}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
