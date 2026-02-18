import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, IndianRupee, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
function ServicePaymentButton({
  serviceRequestId,
  serviceName,
  amount,
  status,
  onPaymentSuccess
}) {
  const { user, profile, session } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  if (status !== "completed") {
    if (status === "paid") {
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600 font-medium", children: [
        /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
        "Payment Completed"
      ] });
    }
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
      "Payment will be enabled after service completion"
    ] });
  }
  if (!amount || amount <= 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
      "Amount not yet set by your CA"
    ] });
  }
  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast.error("Payment gateway is loading. Please try again.");
      return;
    }
    if (!session?.access_token) {
      toast.error("Please log in to make a payment");
      navigate("/auth");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount,
          description: serviceName,
          service_request_id: serviceRequestId
        }
      });
      if (error) {
        console.error("Edge function error:", error);
        toast.error("Failed to create payment order");
        setIsLoading(false);
        return;
      }
      if (!data?.order_id || !data?.key_id) {
        if (data?.error) {
          toast.error(data.error);
        } else {
          toast.error("Invalid response from payment server");
        }
        setIsLoading(false);
        return;
      }
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "GMR & Associates",
        description: serviceName,
        order_id: data.order_id,
        handler: async function(response) {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  payment_id: data.payment_id
                }
              }
            );
            if (verifyError || !verifyData?.success) {
              toast.error("Payment verification failed");
              return;
            }
            toast.success("Payment successful! Your receipt is ready.");
            onPaymentSuccess?.();
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: profile?.name || "",
          email: user?.email || "",
          contact: profile?.phone || ""
        },
        theme: {
          color: "#000000"
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            toast.info("Payment cancelled");
          }
        }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function(response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const gst = Math.round(amount * 0.18);
  const total = amount + gst;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
      "Service: \u20B9",
      amount.toLocaleString(),
      " + GST (18%): \u20B9",
      gst.toLocaleString(),
      " = ",
      /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
        "\u20B9",
        total.toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Button,
      {
        onClick: handlePayment,
        disabled: isLoading,
        size: "sm",
        className: "gap-2",
        children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
          "Processing..."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(IndianRupee, { className: "w-4 h-4" }),
          "Pay \u20B9",
          total.toLocaleString()
        ] })
      }
    )
  ] });
}
export {
  ServicePaymentButton
};
