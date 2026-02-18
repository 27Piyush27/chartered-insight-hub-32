import { jsx, jsxs } from "react/jsx-runtime";
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
  IndianRupee
} from "lucide-react";
import confetti from "canvas-confetti";
function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  useEffect(() => {
    if (!state) {
      navigate("/services");
      return;
    }
    const duration = 3 * 1e3;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#000000", "#333333", "#666666"]
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#000000", "#333333", "#666666"]
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
  const date = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-6 py-16", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 },
      className: "w-full max-w-2xl",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { delay: 0.2, type: "spring", stiffness: 200 },
              className: "w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6",
              children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-10 h-10 text-green-600" })
            }
          ),
          /* @__PURE__ */ jsx(
            motion.h1,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.3 },
              className: "text-3xl md:text-4xl font-semibold tracking-tight mb-3",
              children: "Payment Successful!"
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.4 },
              className: "text-muted-foreground text-lg",
              children: "Thank you for choosing GMR & Associates"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5 },
            children: /* @__PURE__ */ jsxs(Card, { className: "border-border/50 shadow-soft overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "bg-foreground text-background p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-background/70", children: "Payment Receipt" }),
                  /* @__PURE__ */ jsx("p", { className: "font-mono text-sm mt-1", children: paymentId })
                ] }),
                /* @__PURE__ */ jsx(FileText, { className: "w-8 h-8 text-background/50" })
              ] }) }),
              /* @__PURE__ */ jsxs(CardContent, { className: "p-6 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-medium mb-3", children: "Service Details" }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-secondary/50 rounded-lg p-4", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium", children: service.title }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: service.shortDesc }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-3 text-sm text-muted-foreground", children: [
                      /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        "Estimated: ",
                        service.duration
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Separator, {}),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-medium mb-3", children: "Payment Details" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Service Amount" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        "\u20B9",
                        amount.toLocaleString()
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "GST (18%)" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        "\u20B9",
                        gst.toLocaleString()
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(Separator, { className: "my-2" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-semibold text-base", children: [
                      /* @__PURE__ */ jsx("span", { children: "Total Paid" }),
                      /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
                        /* @__PURE__ */ jsx(IndianRupee, { className: "w-4 h-4" }),
                        total.toLocaleString()
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Separator, {}),
                /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxs("p", { children: [
                    "Transaction Date: ",
                    date
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1", children: "Payment Method: Razorpay (UPI/Card/Net Banking)" })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.6 },
            className: "mt-8",
            children: /* @__PURE__ */ jsx(Card, { className: "border-border/50 bg-secondary/30", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium mb-4", children: "What happens next?" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0", children: "1" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Confirmation Email" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "You will receive a confirmation email with all the details." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0", children: "2" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium", children: "CA Assignment" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "A dedicated CA will be assigned to your case within 24 hours." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium flex-shrink-0", children: "3" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Document Collection" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Our team will contact you to collect the required documents." })
                  ] })
                ] })
              ] })
            ] }) })
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.7 },
            className: "mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "support@gmrassociates.com" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "+91 98765 43210" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.8 },
            className: "mt-8 flex flex-col sm:flex-row gap-4 justify-center",
            children: [
              /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "gap-2", children: [
                /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
                "Download Receipt"
              ] }),
              /* @__PURE__ */ jsx(Button, { asChild: true, className: "gap-2", children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard", children: [
                "Go to Dashboard",
                /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
              ] }) })
            ]
          }
        )
      ]
    }
  ) });
}
export {
  PaymentSuccess as default
};
