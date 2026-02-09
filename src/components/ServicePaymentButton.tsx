import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, IndianRupee, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ServicePaymentButtonProps {
  serviceRequestId: string;
  serviceName: string;
  amount: number | null;
  status: string;
  onPaymentSuccess?: () => void;
}

export function ServicePaymentButton({
  serviceRequestId,
  serviceName,
  amount,
  status,
  onPaymentSuccess,
}: ServicePaymentButtonProps) {
  const { user, profile, session } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Only show payment button for completed services
  if (status !== "completed") {
    if (status === "paid") {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
          <Lock className="w-4 h-4" />
          Payment Completed
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        Payment will be enabled after service completion
      </div>
    );
  }

  if (!amount || amount <= 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        Amount not yet set by your CA
      </div>
    );
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
      // Create order via edge function (backend validates service status)
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount,
          description: serviceName,
          service_request_id: serviceRequestId,
        },
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
        handler: async function (response: any) {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  payment_id: data.payment_id,
                },
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
          contact: profile?.phone || "",
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
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

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">
        Service: ₹{amount.toLocaleString()} + GST (18%): ₹{gst.toLocaleString()} = <span className="font-semibold text-foreground">₹{total.toLocaleString()}</span>
      </div>
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        size="sm"
        className="gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <IndianRupee className="w-4 h-4" />
            Pay ₹{total.toLocaleString()}
          </>
        )}
      </Button>
    </div>
  );
}
