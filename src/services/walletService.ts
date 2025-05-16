
import { supabase } from "@/integrations/supabase/client";
import * as solanaWeb3 from "@solana/web3.js";
import { solanaRpcService } from "./solanaRpcService";

export interface WalletData {
  id?: string;
  public_key: string;
  address: string;
  balance: number;
  encrypted_private_key?: string;
  created_at?: string;
}

// IDRS token address on Solana devnet
export const IDRS_TOKEN_ADDRESS = "F56au8BXsvrWcDx3qai7JfojcS1DCdZ7pz4DZ4P8rA3L";

// Service for managing Solana wallets
export const walletService = {
  // Generate a new Solana wallet using the edge function
  async generateWallet(encryptionKey: string) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-solana-wallet', {
        body: { encryptionKey }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate wallet');
      }

      return data;
    } catch (error) {
      console.error('Error generating wallet:', error);
      throw error;
    }
  },

  // Save wallet details to the database
  async saveWallet(walletId: string, publicKey: string, encryptedPrivateKey: string) {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .update({
          public_key: publicKey,
          encrypted_private_key: encryptedPrivateKey,
          address: publicKey // Use public key as the address
        })
        .eq('id', walletId)
        .select();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error saving wallet:', error);
      throw error;
    }
  },

  // Get wallet for current user
  async getUserWallet(): Promise<WalletData | null> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error;
    }
  },

  // Get real-time Solana balance via Helius RPC
  async getSolanaBalance(publicKey: string) {
    try {
      return await solanaRpcService.getBalance(publicKey);
    } catch (error) {
      console.error('Error fetching Solana balance:', error);
      throw error;
    }
  },
  
  // Get real-time IDRS token balance
  async getIdrsBalance(publicKey: string, tokenMintAddress: string = IDRS_TOKEN_ADDRESS) {
    try {
      return await solanaRpcService.getTokenBalance(publicKey, tokenMintAddress);
    } catch (error) {
      console.error('Error fetching IDRS balance:', error);
      return 0; // Default to 0 if we can't fetch the balance
    }
  },
  
  // Get real-time wallet information with balance
  async getWalletInfo(publicKey: string): Promise<{ balance: number; idrsBalance: number }> {
    try {
      const [solBalance, idrsBalance] = await Promise.all([
        this.getSolanaBalance(publicKey),
        this.getIdrsBalance(publicKey)
      ]);
      
      return {
        balance: solBalance,
        idrsBalance: idrsBalance
      };
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      return {
        balance: 0,
        idrsBalance: 0
      };
    }
  }
};
