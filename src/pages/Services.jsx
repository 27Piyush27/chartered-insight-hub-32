import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { servicesData } from "@/lib/servicesData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
import {
  Calculator,
  FileCheck,
  Percent,
  Users,
  TrendingUp,
  Building,
  Shield,
  ClipboardCheck,
  Clock,
  ArrowRight,
  IndianRupee,
  Sparkles,
  Loader2,
  Send
} from "lucide-react";
const iconMap = {
  Calculator: /* @__PURE__ */ jsx(Calculator, { className: "h-6 w-6" }),
  FileCheck: /* @__PURE__ */ jsx(FileCheck, { className: "h-6 w-6" }),
  Percent: /* @__PURE__ */ jsx(Percent, { className: "h-6 w-6" }),
  Users: /* @__PURE__ */ jsx(Users, { className: "h-6 w-6" }),
  TrendingUp: /* @__PURE__ */ jsx(TrendingUp, { className: "h-6 w-6" }),
  Building: /* @__PURE__ */ jsx(Building, { className: "h-6 w-6" }),
  Shield: /* @__PURE__ */ jsx(Shield, { className: "h-6 w-6" }),
  ClipboardCheck: /* @__PURE__ */ jsx(ClipboardCheck, { className: "h-6 w-6" })
};
function Services() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requestingId, setRequestingId] = useState(null);
  const handleRequestService = async (serviceId) => {
    if (!user) {
      toast.error("Please login to request a service");
      navigate("/auth", { state: { redirectTo: `/services` } });
      return;
    }
    setRequestingId(serviceId);
    try {
      const { data: existing, error: checkError } = await supabase.from("service_requests").select("id, status").eq("user_id", user.id).eq("service_id", serviceId).in("status", ["pending", "in_progress", "in-progress", "completed"]);
      if (checkError) throw checkError;
      if (existing && existing.length > 0) {
        toast.info("You already have an active request for this service. Check your dashboard.");
        navigate("/dashboard");
        return;
      }
      const { error: insertError } = await supabase.from("service_requests").insert({
        user_id: user.id,
        service_id: serviceId,
        status: "pending",
        progress: 0
      });
      if (insertError) throw insertError;
      toast.success("Service requested successfully! Track progress on your dashboard.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error requesting service:", error);
      toast.error("Failed to request service. Please try again.");
    } finally {
      setRequestingId(null);
    }
  };
  return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx("section", { className: "py-20 md:py-28 px-6 lg:px-12 text-center border-b border-border/50", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "mb-6 text-xs tracking-widest uppercase", children: "Professional Services" }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight", children: "Expert Financial Solutions" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed", children: "Request a service to get started. Our CA team will work on it and you'll only pay after the work is complete." })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-6 border-b border-border/50 bg-secondary/30", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold", children: "1" }),
        /* @__PURE__ */ jsx("span", { children: "Request Service" })
      ] }),
      /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 hidden md:block" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold", children: "2" }),
        /* @__PURE__ */ jsx("span", { children: "CA Works on It" })
      ] }),
      /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 hidden md:block" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold", children: "3" }),
        /* @__PURE__ */ jsx("span", { children: "Review & Pay" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 md:py-24", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12", children: /* @__PURE__ */ jsx(
      StaggerContainer,
      {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto",
        staggerDelay: 0.08,
        children: servicesData.map((service) => /* @__PURE__ */ jsx(
          StaggerItem,
          {
            className: "group relative",
            children: /* @__PURE__ */ jsxs("div", { className: "h-full bg-background border border-border/50 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:shadow-medium hover:border-border hover:-translate-y-1 flex flex-col relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" }),
              service.popular && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 right-6", children: /* @__PURE__ */ jsxs(Badge, { className: "bg-foreground text-background gap-1", children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }),
                "Popular"
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground", children: iconMap[service.icon] }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: service.category })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-2", children: service.title }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-4 flex-grow", children: service.shortDesc }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mb-4", children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx("span", { children: service.duration })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2 mb-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Starting from" }),
                /* @__PURE__ */ jsxs("span", { className: "text-xl font-semibold flex items-center", children: [
                  /* @__PURE__ */ jsx(IndianRupee, { className: "w-4 h-4" }),
                  service.price.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-secondary/50 p-3 mb-6", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Shield, { className: "w-3.5 h-3.5 flex-shrink-0" }),
                "Payment will be enabled after service completion"
              ] }) }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2 mb-6", children: [
                service.features.slice(0, 3).map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-foreground" }),
                  feature
                ] }, index)),
                service.features.length > 3 && /* @__PURE__ */ jsxs("li", { className: "text-xs text-muted-foreground", children: [
                  "+",
                  service.features.length - 3,
                  " more features"
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: () => handleRequestService(service.id),
                  disabled: requestingId === service.id,
                  className: "w-full group/btn",
                  children: requestingId === service.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }),
                    "Requesting..."
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 mr-2" }),
                    "Request Service"
                  ] })
                }
              )
            ] })
          },
          service.id
        ))
      }
    ) }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-20 md:py-28 bg-foreground text-background relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" }),
      /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 lg:px-12 text-center relative", children: /* @__PURE__ */ jsxs(ScrollReveal, { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm tracking-widest text-background/60 uppercase mb-4", children: "Need a Custom Solution?" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-semibold mb-6 max-w-2xl mx-auto", children: "Don't see what you're looking for?" }),
        /* @__PURE__ */ jsx("p", { className: "text-background/70 mb-10 max-w-xl mx-auto", children: "Every business is unique. Contact us to discuss how we can customize our services to meet your specific requirements." }),
        /* @__PURE__ */ jsx(motion.div, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", variant: "secondary", children: /* @__PURE__ */ jsxs(Link, { to: "/contact", children: [
          "Get in Touch",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
        ] }) }) })
      ] }) })
    ] })
  ] }) });
}
export {
  Services as default
};
