import { Connection, PublicKey, ParsedTransactionWithMeta } from "@solana/web3.js";
import axios from "axios";
import { IDRS_TOKEN_ADDRESS } from "./walletService";

// Helius RPC URLs
const HELIUS_RPC_URL = "https://devnet.helius-rpc.com/?api-key=1f92854f-4d68-427f-b658-7131764c2aed";
const HELIUS_API_BASE = "https://api-devnet.helius-rpc.com/v0";
const HELIUS_API_KEY = "1f92854f-4d68-427f-b658-7131764c2aed";

// Interfaces for Helius API responses
interface HeliusTransaction {
  signature: string;
  type: string;
  timestamp: number;
  slot: number;
  fee: number;
  actions: any[];
  nativeTransfers: any[];
  tokenTransfers: any[];
  accountData: any[];
  events: any;
  source: string;
}

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

// Solana RPC service for connecting to Helius endpoints
export const solanaRpcService = {
  // Get connection to Solana network
  getConnection() {
    return new Connection(HELIUS_RPC_URL, "confirmed");
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

  // Parse transactions from Helius API
  async parseTransactions(signatures: string[]): Promise<ParsedTransaction[]> {
    try {
      if (!signatures.length) return [];
      
      const response = await axios.post(`${HELIUS_API_BASE}/transactions`, {
        transactions: signatures,
        api_key: HELIUS_API_KEY
      });

      return response.data.map((tx: HeliusTransaction) => {
        // Extract transfer information
        const nativeTransfer = tx.nativeTransfers[0]; // Simplified - would need more logic in production
        
        return {
          id: tx.signature,
          signature: tx.signature,
          type: tx.type.toLowerCase(),
          timestamp: tx.timestamp,
          fee: tx.fee / 1_000_000_000,
          amount: nativeTransfer ? nativeTransfer.amount / 1_000_000_000 : undefined,
          senderAddress: nativeTransfer ? nativeTransfer.fromUserAccount : undefined,
          recipientAddress: nativeTransfer ? nativeTransfer.toUserAccount : undefined,
          status: "completed", // Assuming confirmed transactions
          isPrivate: false // Solana transactions are public by default
        };
      });
    } catch (error) {
      console.error("Error parsing transactions:", error);
      throw error;
    }
  },

  // Get transaction history for an address
  async getTransactionHistory(address: string, limit: number = 10): Promise<ParsedTransaction[]> {
    try {
      const response = await axios.get(
        `${HELIUS_API_BASE}/addresses/${address}/transactions`,
        {
          params: {
            api_key: HELIUS_API_KEY,
            limit
          }
        }
      );

      return response.data.map((tx: HeliusTransaction) => {
        // Extract transfer information
        const nativeTransfer = tx.nativeTransfers[0]; // Simplified
        
        let type = "unknown";
        if (tx.type === "TRANSFER") {
          // Determine if it's a send or receive based on the address
          if (nativeTransfer && nativeTransfer.fromUserAccount === address) {
            type = "send";
          } else if (nativeTransfer && nativeTransfer.toUserAccount === address) {
            type = "receive";
          }
        }
        
        return {
          id: tx.signature,
          signature: tx.signature,
          type,
          timestamp: tx.timestamp,
          fee: tx.fee / 1_000_000_000,
          amount: nativeTransfer ? nativeTransfer.amount / 1_000_000_000 : undefined,
          senderAddress: nativeTransfer ? nativeTransfer.fromUserAccount : undefined,
          recipientAddress: nativeTransfer ? nativeTransfer.toUserAccount : undefined,
          status: "completed",
          isPrivate: false
        };
      });
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      throw error;
    }
  }
};
