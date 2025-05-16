
import { supabase } from "@/integrations/supabase/client";
import { solanaRpcService, ParsedTransaction } from "./solanaRpcService";

// Service for managing transactions
export const transactionService = {
  // Get all transactions for the current user's wallet
  async getTransactions(limit?: number) {
    try {
      // Get wallet for the current user
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('id, public_key, address, balance')
        .maybeSingle();
      
      if (walletError) throw walletError;
      if (!wallet) throw new Error("Wallet not found");
      
      // Try to fetch real transactions from Solana if we have a public key
      if (wallet.public_key) {
        try {
          const transactions = await solanaRpcService.getTransactionHistory(wallet.public_key, limit || 10);
          
          if (transactions && transactions.length > 0) {
            return transactions.map(tx => ({
              ...tx,
              wallet_id: wallet.id,
              created_at: new Date(tx.timestamp * 1000).toISOString(), // Convert UNIX timestamp to ISO string
            }));
          }
        } catch (solanaError) {
          console.error("Failed to fetch Solana transactions, falling back to database:", solanaError);
        }
      }
      
      // Fall back to database transactions if we couldn't get real Solana transactions
      let query = supabase
        .from('transactions')
        .select(`
          *,
          payments!payments_transaction_id_fkey (*),
          treasury_wallets (address, public_key)
        `)
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false });
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data: transactions, error } = await query;
      
      if (error) throw error;
      
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
  
  // Create a new transaction
  async createTransaction(type: string, amount: number, isPrivate: boolean, recipientAddress?: string) {
    try {
      // Get wallet for the current user
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('id, public_key, address, balance')
        .maybeSingle();
      
      if (walletError) throw walletError;
      if (!wallet) throw new Error("Wallet not found");
      
      // Get active treasury wallet for minting/redeeming
      let treasuryWalletId = null;
      if (type === 'mint' || type === 'redeem') {
        const { data: treasuryWallet } = await supabase
          .from('treasury_wallets')
          .select('id')
          .eq('is_active', true)
          .single();
          
        if (treasuryWallet) {
          treasuryWalletId = treasuryWallet.id;
        }
      }
      
      const transactionData = {
        wallet_id: wallet.id,
        type,
        amount,
        is_private: isPrivate,
        sender_address: type === 'send' ? wallet.address : undefined,
        recipient_address: type === 'receive' ? wallet.address : recipientAddress,
        status: 'pending',
        treasury_wallet_id: treasuryWalletId
      };
      
      // Create the transaction record
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();
      
      if (error) throw error;
      
      // For mint and redeem, the balance is updated by the Solana transfer process
      // For other types (like send/receive), update the wallet balance locally
      if (type === 'mint') {
        // Mint balance update is handled by the Treasury service and Solana transfer
      } else if (type === 'send' || type === 'redeem') {
        await supabase
          .from('wallets')
          .update({ balance: Math.max(0, wallet.balance - amount) })
          .eq('id', wallet.id);
      } else if (type === 'receive') {
        await supabase
          .from('wallets')
          .update({ balance: wallet.balance + amount })
          .eq('id', wallet.id);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },
  
  // Get transaction details
  async getTransactionById(id: string) {
    try {
      // First check if this is a Solana transaction signature
      if (id.length > 32) { // Solana signatures are longer than our UUID
        try {
          const parsedTx = await solanaRpcService.parseTransactions([id]);
          if (parsedTx && parsedTx.length > 0) {
            return parsedTx[0];
          }
        } catch (solanaError) {
          console.error("Failed to fetch Solana transaction, falling back to database:", solanaError);
        }
      }
      
      // Fall back to database lookup
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          payments!payments_transaction_id_fkey (*),
          treasury_wallets (address, public_key)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }
};
