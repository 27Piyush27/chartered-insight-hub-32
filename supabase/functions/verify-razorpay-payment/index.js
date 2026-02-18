import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const userId = userData.user.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_id } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !payment_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const { data: existingPayment, error: paymentFetchError } = await supabase.from("payments").select("id, user_id, status, service_request_id, razorpay_order_id").eq("id", payment_id).single();
    if (paymentFetchError || !existingPayment) {
      return new Response(
        JSON.stringify({ error: "Payment not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (existingPayment.user_id !== userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized payment access" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (existingPayment.status === "completed") {
      return new Response(
        JSON.stringify({ success: true, message: "Payment already verified" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (existingPayment.razorpay_order_id !== razorpay_order_id) {
      return new Response(
        JSON.stringify({ error: "Payment order mismatch" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac("sha256", razorpayKeySecret).update(body).digest("hex");
    console.log("Verifying payment signature for order:", razorpay_order_id);
    if (expectedSignature !== razorpay_signature) {
      console.error("Signature verification failed");
      await supabaseAdmin.from("payments").update({
        status: "failed",
        razorpay_payment_id,
        razorpay_signature
      }).eq("id", payment_id);
      return new Response(
        JSON.stringify({ error: "Payment verification failed", success: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const { data: payment, error: updateError } = await supabaseAdmin.from("payments").update({
      status: "completed",
      razorpay_payment_id,
      razorpay_signature,
      payment_method: "razorpay"
    }).eq("id", payment_id).select().single();
    if (updateError) {
      console.error("Database update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update payment status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (payment?.service_request_id) {
      console.log("Updating service request status to paid:", payment.service_request_id);
      const { error: srUpdateError } = await supabaseAdmin.from("service_requests").update({ status: "paid", progress: 100 }).eq("id", payment.service_request_id);
      if (srUpdateError) {
        console.error("Failed to update service request status:", srUpdateError);
      } else {
        console.log("Service request marked as paid successfully");
      }
    }
    console.log("Payment verified successfully:", payment_id);
    return new Response(
      JSON.stringify({
        success: true,
        payment,
        message: "Payment verified successfully"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
