import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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
    const { amount, currency = "INR", description, service_request_id } = await req.json();
    if (service_request_id) {
      console.log("Validating service request:", service_request_id);
      const { data: serviceRequest, error: srError } = await supabase.from("service_requests").select("id, status, amount, user_id").eq("id", service_request_id).single();
      if (srError || !serviceRequest) {
        console.error("Service request not found:", srError);
        return new Response(
          JSON.stringify({ error: "Service request not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (serviceRequest.user_id !== userId) {
        console.error("Service request does not belong to user");
        return new Response(
          JSON.stringify({ error: "Unauthorized: Service request does not belong to you" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (serviceRequest.status !== "completed") {
        console.error("Service request status is not completed:", serviceRequest.status);
        const statusMessages = {
          pending: "Service is still pending. Payment will be enabled after completion.",
          in_progress: "Service is still in progress. Payment will be enabled after completion.",
          "in-progress": "Service is still in progress. Payment will be enabled after completion.",
          paid: "This service has already been paid for.",
          cancelled: "This service request has been cancelled."
        };
        return new Response(
          JSON.stringify({
            error: statusMessages[serviceRequest.status] || "Service is not ready for payment"
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!serviceRequest.amount || serviceRequest.amount <= 0) {
        return new Response(
          JSON.stringify({ error: "Final amount has not been set by the CA yet" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const gst = Math.round(serviceRequest.amount * 0.18);
      const totalAmount = serviceRequest.amount + gst;
      console.log("Service request validated. Amount:", totalAmount);
      const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
      const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
      if (!razorpayKeyId || !razorpayKeySecret) {
        console.error("Razorpay credentials not configured");
        return new Response(
          JSON.stringify({ error: "Payment gateway not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const amountInPaise = Math.round(totalAmount * 100);
      const orderPayload = {
        amount: amountInPaise,
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          user_id: userId,
          service_request_id,
          description: description || "Service Payment"
        }
      };
      console.log("Creating Razorpay order:", orderPayload);
      const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`
        },
        body: JSON.stringify(orderPayload)
      });
      if (!razorpayResponse.ok) {
        const errorText = await razorpayResponse.text();
        console.error("Razorpay API error:", errorText);
        return new Response(
          JSON.stringify({ error: "Failed to create payment order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const razorpayOrder = await razorpayResponse.json();
      console.log("Razorpay order created:", razorpayOrder.id);
      const { data: payment, error: dbError } = await supabase.from("payments").insert({
        user_id: userId,
        service_request_id,
        amount: totalAmount,
        currency,
        razorpay_order_id: razorpayOrder.id,
        status: "pending",
        description: description || "Service Payment"
      }).select().single();
      if (dbError) {
        console.error("Database error:", dbError);
        return new Response(
          JSON.stringify({ error: "Failed to record payment" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          payment_id: payment.id,
          key_id: razorpayKeyId
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: "service_request_id is required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
