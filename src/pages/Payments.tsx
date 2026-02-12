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
  Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
}

interface PayableServiceRequest {
  id: string;
  service_id: string;
  status: string;
  amount: number | null;
  created_at: string;
  services: { name: string } | null;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Payments() {
  const navigate = useNavigate();
  const { user, profile, session, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payableRequests, setPayableRequests] = useState<PayableServiceRequest[]>([]);
  const [loadingPayable, setLoadingPayable] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [payingRequestId, setPayingRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
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
  }, [user, authLoading, navigate]);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchPayableRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select("id, service_id, status, amount, created_at, services(name)")
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayableRequests(data || []);
    } catch (error) {
      console.error("Error fetching payable requests:", error);
      toast.error("Failed to load payable services");
    } finally {
      setLoadingPayable(false);
    }
  };

  const handlePayment = async (request: PayableServiceRequest) => {
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
          service_request_id: request.id,
        },
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
          contact: profile?.phone || "",
        },
        theme: {
          color: "#0f172a",
        },
        modal: {
          ondismiss: function () {
            setPayingRequestId(null);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-background/80 hover:text-background hover:bg-background/10 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Payments</h1>
            <p className="text-background/70 text-lg max-w-2xl">
              Payments are enabled only after your CA marks the service as completed.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-sm">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">Instant Confirmation</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Pay only after completion</span>
          </div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Services Ready for Payment
              </CardTitle>
              <CardDescription>
                Only services in completed state with final amount set by your CA appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPayable ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : payableRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No services are ready for payment yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Once your CA marks a request as completed, it will show up here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payableRequests.map((request, index) => {
                    const baseAmount = request.amount || 0;
                    const gst = Math.round(baseAmount * 0.18);
                    const total = baseAmount + gst;
                    const serviceName = request.services?.name || request.service_id;

                    return (
                      <div key={request.id}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-3">
                          <div>
                            <p className="font-medium">{serviceName}</p>
                            <p className="text-sm text-muted-foreground">
                              Requested on {new Date(request.created_at).toLocaleDateString("en-IN")}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              ₹{baseAmount.toLocaleString()} + GST (18%): ₹{gst.toLocaleString()} =
                              <span className="font-semibold text-foreground"> ₹{total.toLocaleString()}</span>
                            </p>
                          </div>
                          <Button
                            onClick={() => handlePayment(request)}
                            disabled={payingRequestId === request.id || !razorpayLoaded || baseAmount <= 0}
                          >
                            {payingRequestId === request.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <IndianRupee className="w-4 h-4 mr-1" />
                                Pay ₹{total.toLocaleString()}
                              </>
                            )}
                          </Button>
                        </div>
                        {index < payableRequests.length - 1 && <Separator />}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Payment History
              </CardTitle>
              <CardDescription>Your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPayments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payment history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment, index) => (
                    <div key={payment.id}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(payment.status)}
                          <div>
                            <p className="font-medium">{payment.description || "Payment"}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.created_at).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                          <Badge
                            variant={payment.status === "completed" ? "default" : payment.status === "failed" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {payment.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      {index < payments.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
