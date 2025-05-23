
import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { IDRS_TOKEN_ADDRESS } from "./walletService";

// Helius API Key
const HELIUS_API_KEY = "1f92854f-4d68-427f-b658-7131764c2aed";
const HELIUS_API_BASE_URL = "https://api.helius.xyz/v0";

// Solana RPC service for connecting to Helius endpoints
export interface ParsedTransaction {
  id: string;
  signature: string;
  type: string;
  timestamp: number;
  fee: number;
  amount?: number;
  senderAddress?: string;
  recipientAddress?: string;
  status: string;
  isPrivate: boolean;
}

export const solanaRpcService = {
  // Get connection to Solana network
  getConnection() {
    return new Connection(`https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, "confirmed");
  },

  // Get account balance
  async getBalance(address: string): Promise<number> {
    try {
      const connection = this.getConnection();
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      return balance / 1_000_000_000; // Convert from lamports to SOL
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  },

  // Get token balance (for IDRS tokens)
  async getTokenBalance(address: string, tokenMintAddress: string = IDRS_TOKEN_ADDRESS): Promise<number> {
    try {
      const connection = this.getConnection();
      const publicKey = new PublicKey(address);
      
      try {
        // Get token accounts owned by this address
        const response = await connection.getTokenAccountsByOwner(publicKey, {
          mint: new PublicKey(tokenMintAddress),
        });
        
        // If we have token accounts, get the balance
        if (response && response.value.length > 0) {
          // Get the balance from the first token account
          const accountInfo = response.value[0].account;
          const accountData = accountInfo.data;
          
          // Token account data has balance at bytes 64-72 (8 bytes)
          const balance = accountData.readBigUInt64LE(64);
          
          // Return the balance with the correct decimal places (2 for IDRS)
          return Number(balance) / 100; // Divide by 100 for 2 decimal places
        }
        
        // If no token accounts found for this token
        console.log(`No ${tokenMintAddress} token accounts found for ${address}`);
        return 0;
      } catch (error) {
        console.error("Error parsing token accounts:", error);
        // For demo/testing, return a placeholder balance if we can't get real token data
        return 10000.00; // Updated placeholder value for testing with 2 decimals
      }
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return 0; // Return 0 if there's an error
    }
  },

  // Parse transactions using direct API calls to Helius
  async parseTransactions(signatures: string[]): Promise<ParsedTransaction[]> {
    try {
      if (!signatures.length) return [];
      
      // Use direct API call to get transaction details
      const response = await axios.post(
        `${HELIUS_API_BASE_URL}/transactions`, 
        {
          transactions: signatures,
          api_key: HELIUS_API_KEY
        }
      );
      
      const transactions = response.data;
      
      return transactions.map((tx: any) => {
        // Extract transfer information from the transaction
        const nativeTransfer = tx.nativeTransfers?.[0];
        
        return {
          id: tx.signature,
          signature: tx.signature,
          type: tx.type?.toLowerCase() || "unknown",
          timestamp: tx.timestamp || Math.floor(Date.now() / 1000),
          fee: (tx.fee || 0) / 1_000_000_000, // Convert lamports to SOL
          amount: nativeTransfer ? nativeTransfer.amount / 1_000_000_000 : undefined,
          senderAddress: nativeTransfer ? nativeTransfer.fromUserAccount : undefined,
          recipientAddress: nativeTransfer ? nativeTransfer.toUserAccount : undefined,
          status: "completed", // Assuming confirmed transactions
          isPrivate: false, // Solana transactions are public by default
          created_at: new Date((tx.timestamp || 0) * 1000).toISOString() // Add created_at for consistency
        };
      });
    } catch (error) {
      console.error("Error parsing transactions:", error);
      throw error;
    }
  },

  // Get transaction history using direct API calls to Helius
  async getTransactionHistory(address: string, limit: number = 10): Promise<ParsedTransaction[]> {
    try {
      console.log(`Getting transaction history for ${address} with limit ${limit}`);
      
      // Use direct API call to get transaction history
      const response = await axios.get(
        `${HELIUS_API_BASE_URL}/addresses/${address}/transactions`, 
        {
          params: {
            api_key: HELIUS_API_KEY,
            limit
          }
        }
      );
      
      const transactions = response.data;
      console.log(`Retrieved ${transactions.length} transactions`);
      
      return transactions.map((tx: any) => {
        // Extract transfer information
        const nativeTransfer = tx.nativeTransfers?.[0];
        
        let type = "unknown";
        // Determine transaction type based on transaction info
        if (tx.type === "TRANSFER") {
          if (nativeTransfer && nativeTransfer.fromUserAccount === address) {
            type = "send";
          } else if (nativeTransfer && nativeTransfer.toUserAccount === address) {
            type = "receive";
          }
        } else if (tx.type) {
          type = tx.type.toLowerCase();
        }
        
        return {
          id: tx.signature,
          signature: tx.signature,
          type,
          timestamp: tx.timestamp || Math.floor(Date.now() / 1000),
          fee: (tx.fee || 0) / 1_000_000_000,
          amount: nativeTransfer ? nativeTransfer.amount / 1_000_000_000 : undefined,
          senderAddress: nativeTransfer ? nativeTransfer.fromUserAccount : undefined,
          recipientAddress: nativeTransfer ? nativeTransfer.toUserAccount : undefined,
          status: "completed",
          isPrivate: false,
          created_at: new Date((tx.timestamp || 0) * 1000).toISOString()
        };
      });
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      throw error;
    }
  }
};
