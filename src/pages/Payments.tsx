import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

interface PaymentHistory {
  id: string;
  amount: number;
  status: "success" | "pending" | "failed";
  date: string;
  description: string;
}

const paymentPlans: PaymentPlan[] = [
  {
    id: "basic",
    name: "Basic Consultation",
    price: 2999,
    description: "One-time consultation for individuals",
    features: [
      "1 Hour Consultation",
      "Tax Planning Advice",
      "Document Review",
      "Email Support",
    ],
  },
  {
    id: "standard",
    name: "Standard Package",
    price: 9999,
    description: "Comprehensive tax filing services",
    features: [
      "Complete ITR Filing",
      "Tax Optimization",
      "Quarterly Reviews",
      "Priority Support",
      "Compliance Check",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Package",
    price: 24999,
    description: "Full-service accounting & tax",
    features: [
      "Everything in Standard",
      "GST Filing",
      "Bookkeeping",
      "Audit Support",
      "Dedicated CA",
      "24/7 Support",
    ],
  },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Payments() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("gmr_current_v5");
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    setUser(JSON.parse(currentUser));

    // Load payment history
    const history = JSON.parse(localStorage.getItem("gmr_payments_v5") || "[]");
    setPaymentHistory(history.filter((p: PaymentHistory) => p.id));

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  const handlePayment = async (amount: number, description: string) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway is loading. Please try again.");
      return;
    }

    setIsLoading(true);

    // In production, you would create an order on your backend
    // For demo, we'll use test mode
    const options = {
      key: "rzp_test_demo", // Replace with your Razorpay key
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "GMR & Associates",
      description: description,
      image: "/logo.png",
      handler: function (response: any) {
        // Payment successful
        const payment: PaymentHistory = {
          id: response.razorpay_payment_id || Date.now().toString(),
          amount: amount,
          status: "success",
          date: new Date().toISOString(),
          description: description,
        };

        const history = JSON.parse(localStorage.getItem("gmr_payments_v5") || "[]");
        history.unshift(payment);
        localStorage.setItem("gmr_payments_v5", JSON.stringify(history));
        setPaymentHistory([payment, ...paymentHistory]);

        toast.success("Payment successful! Thank you for your purchase.");
        setIsLoading(false);
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
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

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Failed to initialize payment. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCustomPayment = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount < 1) {
      toast.error("Please enter a valid amount");
      return;
    }
    handlePayment(amount, "Custom Payment");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Payments
            </h1>
            <p className="text-background/70 text-lg max-w-2xl">
              Choose a service package or make a custom payment securely through Razorpay.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Trust Badges */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-sm">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">Instant Confirmation</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <span className="text-sm">All Cards Accepted</span>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {paymentPlans.map((plan, index) => (
            <motion.div key={plan.id} variants={fadeIn}>
              <Card
                className={`relative h-full transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? "border-primary shadow-lg scale-105" : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handlePayment(plan.price, plan.name)}
                    disabled={isLoading}
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <IndianRupee className="w-4 h-4 mr-1" />
                    Pay ₹{plan.price.toLocaleString()}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom Payment */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
        >
          <Card className="max-w-md mx-auto mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Custom Payment
              </CardTitle>
              <CardDescription>
                Enter a custom amount for specific services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pl-9"
                      min="1"
                    />
                  </div>
                  <Button onClick={handleCustomPayment} disabled={isLoading}>
                    Pay Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment History */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Payment History
              </CardTitle>
              <CardDescription>Your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payment history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment, index) => (
                    <div key={payment.id}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          {payment.status === "success" ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-500" />
                          )}
                          <div>
                            <p className="font-medium">{payment.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payment.date).toLocaleDateString("en-IN", {
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
                            variant={payment.status === "success" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {payment.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      {index < paymentHistory.length - 1 && <Separator />}
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
