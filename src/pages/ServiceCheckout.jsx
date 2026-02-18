import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle,
  CreditCard,
  Smartphone,
  Building2,
  Loader2,
  IndianRupee,
  Lock,
  FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getServiceById } from "@/lib/servicesData";
function ServiceCheckout() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user, profile, session, loading: authLoading } = useAuth();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    const foundService = getServiceById(serviceId || "");
    if (foundService) {
      setService(foundService);
    }
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [serviceId]);
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to continue");
      navigate("/auth", { state: { redirectTo: `/checkout/${serviceId}` } });
    }
  }, [user, authLoading, navigate, serviceId]);
  const handlePayment = async () => {
    if (!service) return;
    if (!razorpayLoaded) {
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
      const { data: serviceRequest, error: requestError } = await supabase.from("service_requests").insert({
        user_id: user.id,
        service_id: service.id,
        status: "pending",
        progress: 0
      }).select().single();
      if (requestError) {
        console.error("Service request error:", requestError);
        toast.error("Failed to create service request");
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: service.price,
          description: service.title,
          service_request_id: serviceRequest.id
        }
      });
      if (error) {
        console.error("Edge function error:", error);
        toast.error("Failed to create payment order");
        setIsLoading(false);
        return;
      }
      if (!data?.order_id || !data?.key_id) {
        toast.error("Invalid response from payment server");
        setIsLoading(false);
        return;
      }
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "GMR & Associates",
        description: service.title,
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
            navigate(`/payment-success`, {
              state: {
                service,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: service.price
              }
            });
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
  if (!service) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Service not found" }),
      /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/services", children: "Back to Services" }) })
    ] }) });
  }
  if (authLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-foreground" }) });
  }
  const discount = service.originalPrice ? service.originalPrice - service.price : 0;
  const gst = Math.round(service.price * 0.18);
  const total = service.price + gst;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-border/50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 py-6", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          onClick: () => navigate("/services"),
          className: "mb-4 -ml-4 text-muted-foreground hover:text-foreground",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
            "Back to Services"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.h1,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: "text-3xl md:text-4xl font-semibold tracking-tight",
          children: "Complete Your Enrollment"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.1 },
          className: "lg:col-span-3 space-y-8",
          children: [
            /* @__PURE__ */ jsxs(Card, { className: "border-border/50", children: [
              /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "mb-3", children: service.category }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: service.title }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: service.description })
              ] }) }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "Estimated delivery: ",
                    service.duration
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Separator, {}),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-medium mb-4", children: "What's Included" }),
                  /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: service.features.map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: feature })
                  ] }, index)) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "border-border/50", children: [
              /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }),
                "Secure Payment Options"
              ] }) }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center p-4 rounded-lg bg-secondary/50 text-center", children: [
                  /* @__PURE__ */ jsx(CreditCard, { className: "w-6 h-6 mb-2 text-muted-foreground" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Credit/Debit Card" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center p-4 rounded-lg bg-secondary/50 text-center", children: [
                  /* @__PURE__ */ jsx(Smartphone, { className: "w-6 h-6 mb-2 text-muted-foreground" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "UPI" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center p-4 rounded-lg bg-secondary/50 text-center", children: [
                  /* @__PURE__ */ jsx(Building2, { className: "w-6 h-6 mb-2 text-muted-foreground" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Net Banking" })
                ] })
              ] }) })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.2 },
          className: "lg:col-span-2",
          children: /* @__PURE__ */ jsx("div", { className: "sticky top-24", children: /* @__PURE__ */ jsxs(Card, { className: "border-border/50 shadow-soft", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5" }),
              "Order Summary"
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: service.title }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "\u20B9",
                    service.originalPrice?.toLocaleString() || service.price.toLocaleString()
                  ] })
                ] }),
                discount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-green-600", children: [
                  /* @__PURE__ */ jsx("span", { children: "Discount" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "- \u20B9",
                    discount.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "\u20B9",
                    service.price.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "GST (18%)" }),
                  /* @__PURE__ */ jsxs("span", { children: [
                    "\u20B9",
                    gst.toLocaleString()
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Separator, {}),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-lg font-semibold", children: [
                /* @__PURE__ */ jsx("span", { children: "Total Payable" }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx(IndianRupee, { className: "w-4 h-4" }),
                  total.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: handlePayment,
                  disabled: isLoading || !razorpayLoaded,
                  className: "w-full h-12 text-base",
                  size: "lg",
                  children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
                    "Processing..."
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 mr-2" }),
                    "Pay \u20B9",
                    total.toLocaleString()
                  ] })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "pt-4 space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(Shield, { className: "w-4 h-4 text-foreground" }),
                  /* @__PURE__ */ jsx("span", { children: "100% Secure & Encrypted Payment" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-foreground" }),
                  /* @__PURE__ */ jsx("span", { children: "Money-back guarantee if not satisfied" })
                ] })
              ] })
            ] })
          ] }) })
        }
      )
    ] }) })
  ] });
}
export {
  ServiceCheckout as default
};
