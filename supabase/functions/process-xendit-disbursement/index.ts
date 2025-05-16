
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = "https://tfekwzfeoctfwoeujzkh.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const XENDIT_API_KEY = Deno.env.get("XENDIT_API_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!XENDIT_API_KEY) {
      console.error('Missing Xendit API key in environment variables');
      return new Response(JSON.stringify({ error: "Xendit API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Parse the request body
    const { amount, bankAccount, transactionId, accountHolderName } = await req.json();
    
    // Validate required fields
    if (!amount || !bankAccount || !transactionId) {
      return new Response(JSON.stringify({
        error: "Missing required fields: amount, bankAccount, and transactionId are required"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Get payment provider
    const { data: provider, error: providerError } = await supabase
      .from('payment_providers')
      .select('*')
      .eq('name', 'Xendit')
      .eq('is_active', true)
      .maybeSingle();

    if (providerError || !provider) {
      console.error('Failed to fetch Xendit payment provider:', providerError);
      return new Response(JSON.stringify({
        error: "Xendit payment provider not found or inactive"
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Generate a unique external ID for Xendit
    const externalId = `redeem-${transactionId}-${Date.now()}`;

    // Get bank details from bankAccount string
    // Assuming format is "BCA" or "bca"
    let bankCode = bankAccount.toUpperCase();
    let accountNumber = "1234567890"; // Placeholder for demo, will be updated in production
    
    // In production, parse the bankAccount value properly
    if (bankAccount.includes('_')) {
      const parts = bankAccount.split('_');
      bankCode = parts[0].toUpperCase();
      accountNumber = parts[1];
    }
    
    if (!bankCode) {
      return new Response(JSON.stringify({
        error: "Invalid bank account format. Expected format: BANK_ACCOUNTNUMBER"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Create a payment record for the disbursement
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        transaction_id: transactionId,
        provider_id: provider.id,
        external_id: externalId,
        amount: amount,
        payment_method: 'disbursement',
        status: 'pending',
        payment_details: {
          bankAccount: bankAccount,
          accountHolderName: accountHolderName || "IDRS User"
        }
      })
      .select()
      .single();

    if (paymentError || !payment) {
      console.error('Failed to create disbursement record:', paymentError);
      return new Response(JSON.stringify({
        error: "Failed to create disbursement record",
        details: paymentError
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Update transaction with payment_id
    const { error: txUpdateError } = await supabase
      .from('transactions')
      .update({ payment_id: payment.id })
      .eq('id', transactionId);
      
    if (txUpdateError) {
      console.error('Failed to update transaction with payment ID:', txUpdateError);
    }

    // Call Xendit API to create a disbursement
    const encodedApiKey = btoa(`${XENDIT_API_KEY}:`);
    
    const holderName = accountHolderName || "IDRS User";
    
    console.log(`Creating Xendit disbursement to ${bankCode} account for ${amount} IDR`);
    
    const xenditResponse = await fetch('https://api.xendit.co/disbursements', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        external_id: externalId,
        amount: amount,
        bank_code: bankCode,
        account_holder_name: holderName,
        account_number: accountNumber,
        description: `IDRS Redeem Transaction: ${amount} IDR`,
        currency: "IDR",
        email_to: ["notifications@rupiahdigital.com"]
      })
    });
    
    const xenditData = await xenditResponse.json();
    
    // Check for Xendit API errors
    if (xenditData.error_code) {
      console.error('Xendit API error:', xenditData);
      
      // Update payment status to failed
      await supabase
        .from('payments')
        .update({ 
          status: 'failed',
          callback_data: xenditData 
        })
        .eq('id', payment.id);
        
      return new Response(JSON.stringify({
        error: "Payment provider error",
        details: xenditData.message || "Failed to create disbursement"
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Update payment record with Xendit data and status
    await supabase
      .from('payments')
      .update({ 
        status: 'processing',
        callback_data: xenditData
      })
      .eq('id', payment.id);
    
    // Log successful creation
    console.log('Successfully created Xendit disbursement:', xenditData.id);

    return new Response(JSON.stringify({
      success: true,
      payment: {
        id: payment.id,
        externalId,
        status: xenditData.status || 'processing',
        disbursementId: xenditData.id
      },
      message: "Disbursement is being processed. It may take 1-2 business days to complete."
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error processing Xendit disbursement:', error);
    
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
