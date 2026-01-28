import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Download,
  ArrowRight,
  Calendar,
  Mail,
  Phone,
  FileText,
  IndianRupee,
} from "lucide-react";
import { ServicePricing } from "@/lib/servicesData";
import confetti from "canvas-confetti";

interface PaymentSuccessState {
  service: ServicePricing;
  paymentId: string;
  orderId: string;
  amount: number;
}

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentSuccessState | null;

  useEffect(() => {
    if (!state) {
      navigate("/services");
      return;
    }

    // Trigger confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#000000", "#333333", "#666666"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#000000", "#333333", "#666666"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const { service, paymentId, amount } = state;
  const gst = Math.round(amount * 0.18);
  const total = amount + gst;
  const date = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Success Icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-semibold tracking-tight mb-3"
          >
            Payment Successful!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            Thank you for choosing GMR & Associates
          </motion.p>
        </div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border/50 shadow-soft overflow-hidden">
            {/* Header */}
            <div className="bg-foreground text-background p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-background/70">Payment Receipt</p>
                  <p className="font-mono text-sm mt-1">{paymentId}</p>
                </div>
                <FileText className="w-8 h-8 text-background/50" />
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Service Details */}
              <div>
                <h3 className="font-medium mb-3">Service Details</h3>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="font-medium">{service.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{service.shortDesc}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Estimated: {service.duration}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Breakdown */}
              <div>
                <h3 className="font-medium mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Amount</span>
                    <span>₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total Paid</span>
                    <span className="flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Transaction Info */}
              <div className="text-sm text-muted-foreground">
                <p>Transaction Date: {date}</p>
                <p className="mt-1">Payment Method: Razorpay (UPI/Card/Net Banking)</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="border-border/50 bg-secondary/30">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Confirmation Email</p>
                    <p className="text-sm text-muted-foreground">
                      You will receive a confirmation email with all the details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium">CA Assignment</p>
                    <p className="text-sm text-muted-foreground">
                      A dedicated CA will be assigned to your case within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Document Collection</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will contact you to collect the required documents.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>support@gmrassociates.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+91 98765 43210</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download Receipt
          </Button>
          <Button asChild className="gap-2">
            <Link to="/dashboard">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
