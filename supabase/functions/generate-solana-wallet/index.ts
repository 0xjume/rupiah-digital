
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Use a working base58 library
import { encode as encodeBase58, decode as decodeBase58 } from "https://deno.land/x/base58check@v0.1.3/mod.ts";
import { Keypair } from "npm:@solana/web3.js";
// Use the correct base64 encoding functions
import { encode as encodeBase64 } from "https://deno.land/std@0.166.0/encoding/base64.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the crypto functions for wallet creation and encryption
const generateSolanaKeypair = () => {
  const keypair = Keypair.generate();
  // Convert the secret key Uint8Array to base64 without using Buffer
  const privateKeyBase64 = encodeBase64(keypair.secretKey);
  
  return {
    publicKey: keypair.publicKey.toString(),
    privateKey: privateKeyBase64
  };
};

// Additional encryption layer for storing private keys
const encryptPrivateKey = async (privateKey: string, encryptionKey: string) => {
  const encoder = new TextEncoder();
  
  // Create a SHA-256 hash of the encryption key to ensure it's the right length for AES-GCM
  const keyData = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(encryptionKey)
  );
  
  // Create a key from the SHA-256 hash of the provided encryption key
  const key = await crypto.subtle.importKey(
    "raw", 
    keyData,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the private key
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(privateKey)
  );
  
  // Combine IV and encrypted data for storage
  const result = {
    iv: encodeBase64(iv),
    data: encodeBase64(new Uint8Array(encryptedData))
  };
  
  return JSON.stringify(result);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  try {
    // Generate a Solana keypair
    const { publicKey, privateKey } = generateSolanaKeypair();
    
    // Parse request body to get the encryption key (user's password hash or other secret)
    const requestData = await req.json();
    const encryptionKey = requestData.encryptionKey;
    
    if (!encryptionKey) {
      return new Response(
        JSON.stringify({ error: "Encryption key is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Encrypt the private key with the user's encryption key
    const encryptedPrivateKey = await encryptPrivateKey(privateKey, encryptionKey);
    
    // Return the public key and encrypted private key
    return new Response(
      JSON.stringify({
        publicKey,
        encryptedPrivateKey,
        success: true
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error generating wallet:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to generate wallet", message: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
