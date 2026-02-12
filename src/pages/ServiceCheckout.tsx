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
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getServiceById, ServicePricing } from "@/lib/servicesData";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ServiceCheckout() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user, profile, session, loading: authLoading } = useAuth();
  
  const [service, setService] = useState<ServicePricing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    // Get service details
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
      // Create service request first
      const { data: serviceRequest, error: requestError } = await supabase
        .from("service_requests")
        .insert({
          user_id: user!.id,
          service_id: service.id,
          status: "pending",
          progress: 0,
        })
        .select()
        .single();

      if (requestError) {
        console.error("Service request error:", requestError);
        toast.error("Failed to create service request");
        setIsLoading(false);
        return;
      }

      // Create order via edge function
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { 
          amount: service.price, 
          description: service.title,
          service_request_id: serviceRequest.id
        },
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

      // Initialize Razorpay
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "GMR & Associates",
        description: service.title,
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

            // Service status is updated to "paid" by the verification edge function.

            // Navigate to confirmation page
            navigate(`/payment-success`, {
              state: {
                service,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: service.price,
              },
            });
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

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Service not found</h1>
          <Button asChild>
            <Link to="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  const discount = service.originalPrice ? service.originalPrice - service.price : 0;
  const gst = Math.round(service.price * 0.18);
  const total = service.price + gst;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/services")}
            className="mb-4 -ml-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-semibold tracking-tight"
          >
            Complete Your Enrollment
          </motion.h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Service Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Selected Service */}
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-3">
                      {service.category}
                    </Badge>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <p className="text-muted-foreground mt-2">{service.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: {service.duration}</span>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">What's Included</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Secure Payment Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 text-center">
                    <CreditCard className="w-6 h-6 mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Credit/Debit Card</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 text-center">
                    <Smartphone className="w-6 h-6 mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">UPI</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 text-center">
                    <Building2 className="w-6 h-6 mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Net Banking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-24">
              <Card className="border-border/50 shadow-soft">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{service.title}</span>
                      <span>₹{service.originalPrice?.toLocaleString() || service.price.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>- ₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{service.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span>₹{gst.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Payable</span>
                    <span className="flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {total.toLocaleString()}
                    </span>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isLoading || !razorpayLoaded}
                    className="w-full h-12 text-base"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pay ₹{total.toLocaleString()}
                      </>
                    )}
                  </Button>

                  {/* Trust Indicators */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 text-foreground" />
                      <span>100% Secure & Encrypted Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-foreground" />
                      <span>Money-back guarantee if not satisfied</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
