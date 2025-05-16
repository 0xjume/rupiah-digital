
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Zod schema for validating Solana wallet addresses
const walletFormSchema = z.object({
  address: z.string()
    .min(32, { message: "Wallet address is required." })
    .refine((address) => {
      try {
        // Validate that the address is a valid Solana public key
        new PublicKey(address);
        return true;
      } catch (error) {
        return false;
      }
    }, { message: "Invalid Solana wallet address." }),
  label: z.string().min(1, { message: "Label is required." })
});

type WalletFormValues = z.infer<typeof walletFormSchema>;

type ExternalWallet = {
  id: string;
  address: string;
  label: string;
};

export default function ExternalWalletForm() {
  const [wallets, setWallets] = useState<ExternalWallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<string | null>(null);
  const { user } = useAuth();

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
      address: "",
      label: ""
    }
  });

  // Fetch user's wallets when component mounts
  const fetchWallets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('external_wallets')
        .select('id, address, label, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure the data matches our ExternalWallet type
      setWallets(data as ExternalWallet[] || []);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast.error("Failed to load wallets");
    }
  };

  // Load wallets on component mount
  useEffect(() => {
    fetchWallets();
  }, [user]);

  // Add a new wallet
  const onSubmit = async (values: WalletFormValues) => {
    if (!user) {
      toast.error("You must be logged in to add a wallet");
      return;
    }
    
    setIsLoading(true);
    try {
      // Validate the wallet address one more time
      try {
        new PublicKey(values.address);
      } catch (error) {
        toast.error("Invalid Solana wallet address");
        setIsLoading(false);
        return;
      }

      // Insert the wallet into the database
      const { error } = await supabase
        .from('external_wallets')
        .insert({
          address: values.address,
          label: values.label,
          user_id: user.id
        });

      if (error) throw error;

      // Reset form and refresh wallets list
      form.reset();
      toast.success("Wallet added successfully!");
      fetchWallets();
    } catch (error: any) {
      toast.error(error.message || "Failed to add wallet");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a wallet
  const deleteWallet = async (id: string) => {
    setIsLoadingDelete(id);
    try {
      const { error } = await supabase
        .from('external_wallets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setWallets(wallets.filter(wallet => wallet.id !== id));
      toast.success("Wallet removed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove wallet");
    } finally {
      setIsLoadingDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solana Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Solana wallet address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Label</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Main Wallet, Hardware Wallet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {isLoading ? "Adding..." : "Add Wallet"}
          </Button>
        </form>
      </Form>

      {/* List of wallets */}
      <div className="space-y-2">
        {wallets.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No external wallets added yet.
          </p>
        ) : (
          wallets.map((wallet) => (
            <div 
              key={wallet.id} 
              className="flex items-center justify-between p-3 bg-accent/50 rounded-md"
            >
              <div>
                <p className="font-medium text-sm">{wallet.label}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-md">
                  {wallet.address}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteWallet(wallet.id)}
                disabled={isLoadingDelete === wallet.id}
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
