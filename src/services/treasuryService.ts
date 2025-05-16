
import { supabase } from "@/integrations/supabase/client";

// Types
export interface TreasuryWallet {
  id: string;
  public_key: string;
  address: string;
  token_address: string;
  balance: number;
  is_active: boolean;
  created_at: string;
}

// Service for managing Treasury operations
export const treasuryService = {
  // Get the active Treasury wallet
  async getTreasuryWallet(): Promise<TreasuryWallet | null> {
    try {
      const { data, error } = await supabase
        .from('treasury_wallets')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching treasury wallet:', error);
      throw error;
    }
  },
  
  // Initialize or create a Treasury wallet (admin function)
  async initializeTreasuryWallet(publicKey?: string, privateKey?: string): Promise<TreasuryWallet | null> {
    try {
      // Check if one exists first
      const existingWallet = await this.getTreasuryWallet();
      if (existingWallet && !publicKey && !privateKey) return existingWallet;
      
      // Call edge function to create a Treasury wallet
      const { data, error } = await supabase.functions.invoke('create-treasury-wallet', {
        body: {
          publicKey,
          privateKey
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to create treasury wallet');
      
      return await this.getTreasuryWallet();
    } catch (error) {
      console.error('Error initializing treasury wallet:', error);
      throw error;
    }
  },
  
  // Process a mint request
  async processMint(amount: number, paymentMethod: string) {
    try {
      // First create a transaction record
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          type: 'mint',
          amount: amount,
          status: 'pending',
          is_private: false,
          wallet_id: null // Will be set by the transaction service
        })
        .select()
        .single();
      
      if (txError) throw txError;
      
      // Call the payment processing function
      const { data, error } = await supabase.functions.invoke('process-xendit-payment', {
        body: {
          amount: amount,
          paymentMethod: paymentMethod,
          transactionId: transaction.id
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to process payment');
      
      return {
        transaction: transaction,
        payment: data.payment
      };
    } catch (error) {
      console.error('Error processing mint:', error);
      throw error;
    }
  },
  
  // Process a redeem request
  async processRedeem(amount: number, bankAccount: string, walletId: string) {
    try {
      // First, create a transaction record
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          type: 'redeem',
          amount: amount,
          status: 'pending',
          is_private: false,
          wallet_id: walletId
        })
        .select()
        .single();
      
      if (txError) throw txError;
      
      // Get the Treasury wallet
      const treasuryWallet = await this.getTreasuryWallet();
      if (!treasuryWallet) throw new Error('Treasury wallet not found');
      
      // For the redeem process:
      // 1. First, we do the token transfer from user to Treasury
      // 2. Then, we do the IDR disbursement to the user's bank account
      
      // Call the Solana transfer function to move tokens to Treasury
      const { data: transferData, error: transferError } = await supabase.functions.invoke('process-solana-transfer', {
        body: {
          amount: amount,
          recipientAddress: treasuryWallet.address,
          transactionId: transaction.id,
          transactionType: 'redeem'
        }
      });
      
      if (transferError) throw transferError;
      if (!transferData.success) throw new Error(transferData.error || 'Failed to process token transfer');
      
      // Now that the tokens are transferred, process the disbursement
      const { data: disbursementData, error: disbursementError } = await supabase.functions.invoke('process-xendit-disbursement', {
        body: {
          amount: amount,
          bankAccount: bankAccount,
          transactionId: transaction.id
        }
      });
      
      if (disbursementError) throw disbursementError;
      if (!disbursementData.success) throw new Error(disbursementData.error || 'Failed to process disbursement');
      
      return {
        transaction: transaction,
        transfer: transferData,
        disbursement: disbursementData.payment
      };
    } catch (error) {
      console.error('Error processing redeem:', error);
      throw error;
    }
  },
  
  // Create or update a Treasury wallet with specific keys (admin function)
  async updateTreasuryWallet(publicKey: string, privateKey: string): Promise<TreasuryWallet | null> {
    try {
      if (!publicKey || !privateKey) {
        throw new Error('Both public key and private key are required');
      }
      
      // Call the edge function to create/update the Treasury wallet with provided keys
      const { data, error } = await supabase.functions.invoke('create-treasury-wallet', {
        body: {
          publicKey,
          privateKey
        }
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to update treasury wallet');
      
      return await this.getTreasuryWallet();
    } catch (error) {
      console.error('Error updating treasury wallet:', error);
      throw error;
    }
  }
};
