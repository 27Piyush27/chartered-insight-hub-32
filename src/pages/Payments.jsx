import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  CreditCard,
  IndianRupee,
  CheckCircle,
  Clock,
  FileText,
  ArrowLeft,
  Shield,
  Zap,
  Loader2,
  AlertCircle,
  Lock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
function Payments() {
  const navigate = useNavigate();
  const { user, profile, session, role, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState([]);
  const [payableRequests, setPayableRequests] = useState([]);
  const [loadingPayable, setLoadingPayable] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [payingRequestId, setPayingRequestId] = useState(null);
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!authLoading && user && role !== "client") {
      toast.error("Only clients can access the payment page.");
      navigate("/admin");
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    if (user) {
      fetchPayments();
      fetchPayableRequests();
    }
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [user, role, authLoading, navigate]);
  const fetchPayments = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoadingPayments(false);
    }
  };
  const fetchPayableRequests = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("service_requests").select("id, service_id, status, amount, created_at, services(name)").eq("user_id", user.id).eq("status", "completed").order("created_at", { ascending: false });
      if (error) throw error;
      setPayableRequests(data || []);
    } catch (error) {
      console.error("Error fetching payable requests:", error);
      toast.error("Failed to load payable services");
    } finally {
      setLoadingPayable(false);
    }
  };
  const handlePayment = async (request) => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway is loading. Please try again.");
      return;
    }
    if (!session?.access_token) {
      toast.error("Please log in to make a payment");
      navigate("/auth");
      return;
    }
    if (request.status !== "completed") {
      toast.error("Payment is available only after CA marks this service as completed.");
      return;
    }
    if (!request.amount || request.amount <= 0) {
      toast.error("Final amount has not been set by your CA yet.");
      return;
    }
    const serviceName = request.services?.name || request.service_id;
    setPayingRequestId(request.id);
    try {
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: request.amount,
          description: serviceName,
          service_request_id: request.id
        }
      });
      if (error) {
        console.error("Edge function error:", error);
        toast.error("Failed to create payment order");
        return;
      }
      if (!data?.order_id || !data?.key_id) {
        if (data?.error) {
          toast.error(data.error);
        } else {
          toast.error("Invalid response from payment server");
        }
        return;
      }
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "GMR & Associates",
        description: `Payment for ${serviceName}`,
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
              setPayingRequestId(null);
              return;
            }
            toast.success("Payment successful! Your service is now marked as paid.");
            setPayingRequestId(null);
            fetchPayments();
            fetchPayableRequests();
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verification failed");
            setPayingRequestId(null);
          }
        },
        prefill: {
          name: profile?.name || "",
          email: user?.email || "",
          contact: profile?.phone || ""
        },
        theme: {
          color: "#0f172a"
        },
        modal: {
          ondismiss: function() {
            setPayingRequestId(null);
            toast.info("Payment cancelled");
          }
        }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function(response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setPayingRequestId(null);
      });
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setPayingRequestId(null);
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-green-500" });
      case "pending":
      case "processing":
        return /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-yellow-500" });
      case "failed":
        return /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-red-500" });
      default:
        return /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-muted-foreground" });
    }
  };
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  if (authLoading || !user || role !== "client") {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-foreground text-background py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          onClick: () => navigate("/dashboard"),
          className: "text-background/80 hover:text-background hover:bg-background/10 mb-6",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
            "Back to Dashboard"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", animate: "visible", variants: fadeIn, transition: { duration: 0.5 }, children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-semibold tracking-tight mb-4", children: "Payments" }),
        /* @__PURE__ */ jsx("p", { className: "text-background/70 text-lg max-w-2xl", children: "Payments are enabled only after your CA marks the service as completed." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12 space-y-12", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: "hidden", animate: "visible", variants: fadeIn, className: "flex flex-wrap justify-center gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-green-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Secure Payments" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Zap, { className: "w-5 h-5 text-yellow-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Instant Confirmation" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-blue-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Pay only after completion" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(motion.div, { initial: "hidden", animate: "visible", variants: fadeIn, children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "w-5 h-5" }),
            "Services Ready for Payment"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Only services in completed state with final amount set by your CA appear here." })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: loadingPayable ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-primary" }) }) : payableRequests.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsx(Clock, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No services are ready for payment yet." }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Once your CA marks a request as completed, it will show up here." })
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: payableRequests.map((request, index) => {
          const baseAmount = request.amount || 0;
          const gst = Math.round(baseAmount * 0.18);
          const total = baseAmount + gst;
          const serviceName = request.services?.name || request.service_id;
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: serviceName }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "Requested on ",
                  new Date(request.created_at).toLocaleDateString("en-IN")
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                  "\u20B9",
                  baseAmount.toLocaleString(),
                  " + GST (18%): \u20B9",
                  gst.toLocaleString(),
                  " =",
                  /* @__PURE__ */ jsxs("span", { className: "font-semibold text-foreground", children: [
                    " \u20B9",
                    total.toLocaleString()
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: () => handlePayment(request),
                  disabled: payingRequestId === request.id || !razorpayLoaded || baseAmount <= 0,
                  children: payingRequestId === request.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
                    "Processing..."
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(IndianRupee, { className: "w-4 h-4 mr-1" }),
                    "Pay \u20B9",
                    total.toLocaleString()
                  ] })
                }
              )
            ] }),
            index < payableRequests.length - 1 && /* @__PURE__ */ jsx(Separator, {})
          ] }, request.id);
        }) }) })
      ] }) }),
      /* @__PURE__ */ jsx(motion.div, { initial: "hidden", animate: "visible", variants: fadeIn, children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5" }),
            "Payment History"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Your recent transactions" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: loadingPayments ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin text-primary" }) }) : payments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsx(CreditCard, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No payment history yet" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: payments.map((payment, index) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              getStatusIcon(payment.status),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: payment.description || "Payment" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: new Date(payment.created_at).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
                "\u20B9",
                payment.amount.toLocaleString()
              ] }),
              /* @__PURE__ */ jsx(
                Badge,
                {
                  variant: payment.status === "completed" ? "default" : payment.status === "failed" ? "destructive" : "secondary",
                  className: "text-xs",
                  children: payment.status.toUpperCase()
                }
              )
            ] })
          ] }),
          index < payments.length - 1 && /* @__PURE__ */ jsx(Separator, {})
        ] }, payment.id)) }) })
      ] }) })
    ] })
  ] });
}
export {
  Payments as default
};
