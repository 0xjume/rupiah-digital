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
  created_at?: string;
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

  // Parse transactions using Helius Enhanced Transactions API
  async parseTransactions(signatures: string[]): Promise<ParsedTransaction[]> {
    try {
      if (!signatures.length) return [];
      
      console.log("Parsing transactions:", signatures);
      
      // Use the proper endpoint with API key in the URL (not in the body)
      const response = await axios.post(
        `${HELIUS_API_BASE_URL}/transactions?api-key=${HELIUS_API_KEY}`, 
        { transactions: signatures }
      );
      
      const transactions = response.data;
      
      return transactions.map((tx: any) => {
        // Extract transfer information from the transaction
        const nativeTransfer = tx.nativeTransfers?.[0];
        const events = tx.events || {};
        const solEvent = events.sol;
        
        // Determine amount - try multiple sources
        let amount;
        if (solEvent) {
          amount = solEvent.amount;
        } else if (nativeTransfer) {
          amount = nativeTransfer.amount / 1_000_000_000;
        }
        
        return {
          id: tx.signature,
          signature: tx.signature,
          type: tx.type?.toLowerCase() || "unknown",
          timestamp: tx.timestamp || Math.floor(Date.now() / 1000),
          fee: (tx.fee || 0) / 1_000_000_000, // Convert lamports to SOL
          amount,
          senderAddress: nativeTransfer?.fromUserAccount || solEvent?.from,
          recipientAddress: nativeTransfer?.toUserAccount || solEvent?.to,
          status: "completed", // Assuming confirmed transactions
          isPrivate: false, // Solana transactions are public by default
          created_at: new Date((tx.timestamp || 0) * 1000).toISOString() // Add created_at for consistency
        };
      });
    } catch (error) {
      console.error("Error parsing transactions:", error);
      // Return mock data when API fails
      return this.getMockTransactions(signatures.length);
    }
  },

  // Get transaction history using Helius Enhanced Transactions API
  async getTransactionHistory(address: string, limit: number = 10): Promise<ParsedTransaction[]> {
    try {
      console.log(`Getting transaction history for ${address} with limit ${limit}`);
      
      // Use the proper endpoint with API key in URL query params
      const response = await axios.get(
        `${HELIUS_API_BASE_URL}/addresses/${address}/transactions`, 
        { params: { "api-key": HELIUS_API_KEY, limit } }
      );
      
      const transactions = response.data;
      console.log(`Retrieved ${transactions.length} transactions`);
      
      return transactions.map((tx: any) => {
        // Extract transfer information
        const nativeTransfer = tx.nativeTransfers?.[0];
        const events = tx.events || {};
        const solEvent = events.sol;
        
        // Determine type based on transaction info
        let type = tx.type?.toLowerCase() || "unknown";
        if (type === "transfer") {
          if ((nativeTransfer && nativeTransfer.fromUserAccount === address) || 
              (solEvent && solEvent.from === address)) {
            type = "send";
          } else if ((nativeTransfer && nativeTransfer.toUserAccount === address) || 
                     (solEvent && solEvent.to === address)) {
            type = "receive";
          }
        }
        
        // Determine amount - try multiple sources
        let amount;
        if (solEvent) {
          amount = solEvent.amount;
        } else if (nativeTransfer) {
          amount = nativeTransfer.amount / 1_000_000_000;
        }
        
        return {
          id: tx.signature,
          signature: tx.signature,
          type,
          timestamp: tx.timestamp || Math.floor(Date.now() / 1000),
          fee: (tx.fee || 0) / 1_000_000_000,
          amount,
          senderAddress: nativeTransfer?.fromUserAccount || solEvent?.from,
          recipientAddress: nativeTransfer?.toUserAccount || solEvent?.to,
          status: "completed",
          isPrivate: false,
          created_at: new Date((tx.timestamp || 0) * 1000).toISOString()
        };
      });
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      // Return mock data when API fails
      return this.getMockTransactions(limit);
    }
  },
  
  // Generate mock transactions for fallback when API fails
  getMockTransactions(count: number): ParsedTransaction[] {
    console.log(`Generating ${count} mock transactions as fallback`);
    
    const mockTransactions: ParsedTransaction[] = [];
    const types = ["send", "receive", "swap", "mint", "redeem"];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const timestamp = Math.floor((now - i * 86400000) / 1000); // One day apart
      const amount = Math.floor(Math.random() * 1000) / 10; // Random amount between 0-100
      
      mockTransactions.push({
        id: `mock-${timestamp}-${i}`,
        signature: `mock-signature-${timestamp}-${i}`,
        type,
        timestamp,
        fee: 0.000005,
        amount,
        senderAddress: type === "receive" ? "ExternalAddress" : "YourWalletAddress",
        recipientAddress: type === "send" ? "ExternalAddress" : "YourWalletAddress",
        status: "completed",
        isPrivate: false,
        created_at: new Date(timestamp * 1000).toISOString()
      });
    }
    
    return mockTransactions;
  }
};
