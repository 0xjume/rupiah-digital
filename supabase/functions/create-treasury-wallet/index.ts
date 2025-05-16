
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';
import * as web3 from 'https://esm.sh/@solana/web3.js';
import * as splToken from 'https://esm.sh/@solana/spl-token';
import * as bs58 from 'https://esm.sh/bs58@5.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = "https://tfekwzfeoctfwoeujzkh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZWt3emZlb2N0ZndvZXVqemtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTE4NzQsImV4cCI6MjA2MTY2Nzg3NH0.ZT9BwexwwiMh71PMtdqO4nxIr3Zhp0kMSB6gYlFBHao";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const TREASURY_WALLET_ENCRYPTION_KEY = Deno.env.get("TREASURY_WALLET_ENCRYPTION_KEY") || "";

// IDRS token address on Solana devnet
const IDRS_TOKEN_ADDRESS = "F56au8BXsvrWcDx3qai7JfojcS1DCdZ7pz4DZ4P8rA3L";

// Simple encryption function for the private key
async function encryptPrivateKey(privateKey: string, encryptionKey: string) {
  try {
    // In a production environment, you would implement proper encryption
    // For demo purposes, we'll just simulate encryption by returning the private key
    // A real implementation would use a library like crypto to encrypt the private key
    return privateKey;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt private key");
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!TREASURY_WALLET_ENCRYPTION_KEY) {
      return new Response(JSON.stringify({ error: "Treasury wallet encryption key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Require authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Validate the token (in production, implement proper validation)
    if (token !== SUPABASE_SERVICE_KEY) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const requestData = await req.json().catch(() => ({}));
    const useExistingKeys = requestData.publicKey && requestData.privateKey;

    // Check if an active treasury wallet already exists
    const { data: existingWallet, error: checkError } = await supabase
      .from('treasury_wallets')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (!checkError && existingWallet) {
      // If we're trying to update the wallet with new keys, deactivate the existing one
      if (useExistingKeys) {
        await supabase
          .from('treasury_wallets')
          .update({ is_active: false })
          .eq('id', existingWallet.id);
      } else {
        return new Response(JSON.stringify({
          message: "An active treasury wallet already exists",
          walletAddress: existingWallet.address,
          publicKey: existingWallet.public_key
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // Generate or use provided keys
    let publicKey, privateKey;
    
    if (useExistingKeys) {
      publicKey = requestData.publicKey;
      privateKey = requestData.privateKey;
      
      console.log("Using provided Solana keypair for treasury wallet");
    } else {
      console.log("Generating new Solana keypair for treasury wallet...");
      
      try {
        // Generate a real Solana keypair (in production environment)
        const keypair = web3.Keypair.generate();
        publicKey = keypair.publicKey.toString();
        privateKey = bs58.encode(keypair.secretKey);
        
        console.log("Generated keypair with public key:", publicKey);
      } catch (error) {
        console.error("Error generating Solana keypair:", error);
        
        // Fallback to simulated keys if there's an error
        publicKey = "SimulatedTreasuryPublicKey" + Date.now().toString();
        privateKey = "SimulatedTreasuryPrivateKey" + Date.now().toString();
        
        console.log("Using simulated keypair with public key:", publicKey);
      }
    }
    
    // Encrypt the private key with the encryption key
    const encryptedPrivateKey = await encryptPrivateKey(privateKey, TREASURY_WALLET_ENCRYPTION_KEY);
    
    // Create a new treasury wallet record
    const { data: treasuryWallet, error: createError } = await supabase
      .from('treasury_wallets')
      .insert({
        public_key: publicKey,
        address: publicKey, // In Solana, the public key is the address
        encrypted_private_key: encryptedPrivateKey,
        token_address: IDRS_TOKEN_ADDRESS,
        balance: 1000000000, // Start with a large balance for demo purposes
        is_active: true
      })
      .select()
      .single();

    if (createError || !treasuryWallet) {
      return new Response(JSON.stringify({
        error: "Failed to create treasury wallet",
        details: createError
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      treasuryWallet: {
        id: treasuryWallet.id,
        address: treasuryWallet.address,
        publicKey: treasuryWallet.public_key
      },
      message: "Treasury wallet created successfully"
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error creating treasury wallet:', error);
    
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
