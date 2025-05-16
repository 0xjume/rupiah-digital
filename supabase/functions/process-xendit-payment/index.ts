
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
    console.log("Starting process-xendit-payment function");
    
    if (!XENDIT_API_KEY) {
      console.error('Missing Xendit API key in environment variables');
      return new Response(JSON.stringify({ error: "Xendit API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Parse the request body
    const requestBody = await req.text();
    console.log("Request body:", requestBody);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    const { amount, paymentMethod, transactionId, bankAccountName, email } = parsedBody;
    console.log("Parsed request:", { amount, paymentMethod, transactionId, bankAccountName, email });
    
    // Validate required fields
    if (!amount || !paymentMethod || !transactionId) {
      console.error("Missing required fields:", { amount, paymentMethod, transactionId });
      return new Response(JSON.stringify({
        error: "Missing required fields: amount, paymentMethod, and transactionId are required"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log("Initialized Supabase client");
    
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

    console.log("Found payment provider:", provider);

    // Generate a unique external ID for Xendit
    const externalId = `${transactionId}-${Date.now()}`;

    // Create a payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        transaction_id: transactionId,
        provider_id: provider.id,
        external_id: externalId,
        amount: amount,
        payment_method: paymentMethod,
        status: 'pending',
        payment_details: {
          bankAccountName: bankAccountName || "IDRS User",
          email: email || "customer@example.com"
        }
      })
      .select()
      .single();

    if (paymentError || !payment) {
      console.error('Failed to create payment record:', paymentError);
      return new Response(JSON.stringify({
        error: "Failed to create payment record",
        details: paymentError
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log("Created payment record:", payment);

    // Update transaction with payment_id
    const { error: txUpdateError } = await supabase
      .from('transactions')
      .update({ payment_id: payment.id })
      .eq('id', transactionId);
      
    if (txUpdateError) {
      console.error('Failed to update transaction with payment ID:', txUpdateError);
    } else {
      console.log(`Updated transaction ${transactionId} with payment_id ${payment.id}`);
    }

    // Call Xendit API to create an invoice/payment link
    const encodedApiKey = btoa(`${XENDIT_API_KEY}:`);
    
    // Map our internal payment method to Xendit's payment channels
    let paymentChannels = [];
    switch (paymentMethod) {
      case 'e_wallet':
        paymentChannels = ['OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY'];
        break;
      case 'credit_card':
        paymentChannels = ['CREDIT_CARD'];
        break;
      case 'bank_transfer':
        paymentChannels = ['BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA'];
        break;
      default:
        paymentChannels = ['BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA'];
    }
    
    const customerEmail = email || "customer@example.com";
    
    console.log('Creating Xendit invoice with external_id:', externalId);
    console.log('Payment channels:', paymentChannels);
    
    // Create Xendit invoice request payload
    const xenditPayload = {
      external_id: externalId,
      amount: amount,
      payer_email: customerEmail,
      description: `IDRS Mint Transaction: ${amount} IDR`,
      invoice_duration: 86400, // 24 hours
      currency: "IDR",
      success_redirect_url: "https://app.rupiahdigital.com/payment/success",
      failure_redirect_url: "https://app.rupiahdigital.com/payment/failure",
      payment_methods: paymentChannels,
      callback_virtual_account_id: externalId, // For better tracking
      should_send_email: true
    };
    
    console.log("Xendit payload:", JSON.stringify(xenditPayload));
    
    const xenditResponse = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(xenditPayload)
    });
    
    console.log("Xendit API status:", xenditResponse.status);
    console.log("Xendit API headers:", JSON.stringify([...xenditResponse.headers.entries()]));
    
    const xenditResponseText = await xenditResponse.text();
    console.log("Xendit API response text:", xenditResponseText);
    
    let xenditData;
    try {
      xenditData = JSON.parse(xenditResponseText);
    } catch (e) {
      console.error("Failed to parse Xendit response as JSON:", e);
      
      // Update payment with raw response
      await supabase
        .from('payments')
        .update({ 
          status: 'failed',
          callback_data: { raw_response: xenditResponseText }
        })
        .eq('id', payment.id);
        
      return new Response(JSON.stringify({
        error: "Invalid response from payment provider",
        details: "Failed to parse response as JSON"
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
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
        details: xenditData.message || "Failed to create payment link"
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    console.log("Xendit API success response:", JSON.stringify(xenditData));
    
    // Update payment record with Xendit data
    await supabase
      .from('payments')
      .update({ 
        callback_data: xenditData
      })
      .eq('id', payment.id);
    
    // Log successful creation
    console.log('Successfully created Xendit invoice:', xenditData.id);

    return new Response(JSON.stringify({
      success: true,
      payment: {
        id: payment.id,
        externalId,
        paymentLink: xenditData.invoice_url
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error processing Xendit payment:', error);
    
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
