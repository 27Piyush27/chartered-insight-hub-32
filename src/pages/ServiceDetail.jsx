import { jsx, jsxs } from "react/jsx-runtime";
import { useParams, Link, useNavigate } from "react-router-dom";
import { services } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Calculator, FileCheck, Receipt, FileText, PieChart, Settings, CheckCircle, Shield, Search, AlertCircle, TrendingUp, Scale, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
const iconMap = {
  Calculator: /* @__PURE__ */ jsx(Calculator, { className: "h-8 w-8" }),
  FileCheck: /* @__PURE__ */ jsx(FileCheck, { className: "h-8 w-8" }),
  Receipt: /* @__PURE__ */ jsx(Receipt, { className: "h-8 w-8" }),
  FileText: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
  PieChart: /* @__PURE__ */ jsx(PieChart, { className: "h-5 w-5" }),
  Settings: /* @__PURE__ */ jsx(Settings, { className: "h-5 w-5" }),
  CheckCircle: /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5" }),
  Shield: /* @__PURE__ */ jsx(Shield, { className: "h-5 w-5" }),
  Search: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5" }),
  AlertCircle: /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5" }),
  TrendingUp: /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5" }),
  Scale: /* @__PURE__ */ jsx(Scale, { className: "h-5 w-5" }),
  Users: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" })
};
function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = services.find((s) => s.id === serviceId);
  if (!service) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-4", children: "Service not found" }),
      /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/services", children: "Back to Services" }) })
    ] }) });
  }
  const handleRequestService = () => {
    const currentUser = localStorage.getItem("gmr_current_v5");
    if (!currentUser) {
      toast.error("Please login to request services");
      navigate("/auth");
      return;
    }
    const user = JSON.parse(currentUser);
    const requests = JSON.parse(localStorage.getItem("gmr_requests_v5") || "[]");
    const newRequest = {
      id: Date.now().toString(),
      userId: user.email,
      serviceId: service.id,
      serviceName: service.title,
      status: "pending",
      requestDate: (/* @__PURE__ */ new Date()).toISOString(),
      progress: 0
    };
    requests.push(newRequest);
    localStorage.setItem("gmr_requests_v5", JSON.stringify(requests));
    toast.success("Service requested successfully! Check your dashboard for updates.");
    navigate("/dashboard");
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx("section", { className: "py-20 gradient-hero text-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          variant: "secondary",
          className: "mb-6",
          children: /* @__PURE__ */ jsxs(Link, { to: "/services", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            " Back to Services"
          ] })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white/10 w-20 h-20 rounded-xl flex items-center justify-center text-white mb-6", children: iconMap[service.icon] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-6 animate-slide-up", children: service.title }),
        /* @__PURE__ */ jsx("p", { className: "text-xl opacity-95 animate-fade-in", children: service.desc })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-12 text-center", children: "Key Features" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto", children: service.features.map((feature, index) => /* @__PURE__ */ jsx(
        Card,
        {
          className: "shadow-card animate-slide-up",
          style: { animationDelay: `${index * 0.1}s` },
          children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-primary/10 p-3 rounded-lg text-primary flex-shrink-0", children: iconMap[feature.icon] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: feature.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: feature.text })
            ] })
          ] }) })
        },
        index
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-12 text-center", children: "Our Process" }),
      /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: service.timeline.map((step, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex gap-6 animate-slide-up",
          style: { animationDelay: `${index * 0.1}s` },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0", children: index + 1 }),
              index < service.timeline.length - 1 && /* @__PURE__ */ jsx("div", { className: "w-0.5 h-full bg-primary/30 mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 pb-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-2", children: step.title }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: step.text })
            ] })
          ]
        },
        index
      )) }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-12 text-center", children: "Frequently Asked Questions" }),
      /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "space-y-4", children: service.faqs.map((faq, index) => /* @__PURE__ */ jsxs(AccordionItem, { value: `item-${index}`, children: [
        /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left", children: faq.q }),
        /* @__PURE__ */ jsx(AccordionContent, { className: "text-muted-foreground", children: faq.a })
      ] }, index)) }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 gradient-hero text-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: "Ready to Get Started?" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl mb-8 max-w-2xl mx-auto opacity-95", children: "Request this service now and our expert team will get in touch with you within 24 hours." }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          onClick: handleRequestService,
          size: "lg",
          className: "bg-white text-primary hover:bg-white/90 shadow-lg",
          children: [
            "Request ",
            service.title
          ]
        }
      )
    ] }) })
  ] });
}
export {
  ServiceDetail as default
};
