import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  TrendingUp,
  User,
  CreditCard,
  Loader2,
  Shield,
  Briefcase,
  Download
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useServiceNotifications } from "@/hooks/useServiceNotifications";
import { ServiceStatusStepper } from "@/components/ServiceStatusStepper";
import { ServicePaymentButton } from "@/components/ServicePaymentButton";
import { ClientDocumentUpload } from "@/components/ClientDocumentUpload";
import { ChatbotWidget } from "@/components/ChatbotWidget";
function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, role, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const fetchServiceRequests = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase.from("service_requests").select(`
          id, user_id, service_id, status, progress, notes,
          amount, document_url, created_at,
          services (name)
        `).eq("user_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  }, []);
  useServiceNotifications(() => fetchServiceRequests(user?.id));
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!authLoading && (role === "admin" || role === "ca")) {
      navigate("/admin");
      return;
    }
    if (user && role === "client") {
      fetchServiceRequests(user.id);
    }
  }, [user, role, authLoading, navigate, fetchServiceRequests]);
  const handleDownloadDocument = async (documentUrl) => {
    try {
      const { data, error } = await supabase.storage.from("service-documents").download(documentUrl);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = documentUrl.split("/").pop() || "document";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  if (authLoading || !user) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-green-500" });
      case "in_progress":
      case "in-progress":
        return /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-blue-500" });
      case "paid":
        return /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5 text-green-600" });
      case "cancelled":
        return /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-red-500" });
      default:
        return /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-yellow-500" });
    }
  };
  const getStatusBadge = (status) => {
    const config = {
      completed: { variant: "default", label: "COMPLETED \u2014 READY TO PAY" },
      "in_progress": { variant: "secondary", label: "IN PROGRESS" },
      "in-progress": { variant: "secondary", label: "IN PROGRESS" },
      pending: { variant: "outline", label: "PENDING" },
      paid: { variant: "default", label: "PAID" },
      cancelled: { variant: "destructive", label: "CANCELLED" }
    };
    const c = config[status] || { variant: "outline", label: status.toUpperCase() };
    return /* @__PURE__ */ jsx(Badge, { variant: c.variant, children: c.label });
  };
  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return /* @__PURE__ */ jsx(Shield, { className: "h-8 w-8" });
      case "ca":
        return /* @__PURE__ */ jsx(Briefcase, { className: "h-8 w-8" });
      default:
        return /* @__PURE__ */ jsx(User, { className: "h-8 w-8" });
    }
  };
  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "ca":
        return "Chartered Accountant";
      default:
        return "Client";
    }
  };
  const stats = [
    {
      icon: /* @__PURE__ */ jsx(FileText, { className: "h-8 w-8 text-primary" }),
      label: "Total Services",
      value: requests.length
    },
    {
      icon: /* @__PURE__ */ jsx(Clock, { className: "h-8 w-8 text-yellow-500" }),
      label: "In Progress",
      value: requests.filter((r) => r.status === "in_progress" || r.status === "in-progress").length
    },
    {
      icon: /* @__PURE__ */ jsx(CheckCircle, { className: "h-8 w-8 text-green-500" }),
      label: "Ready to Pay",
      value: requests.filter((r) => r.status === "completed").length
    },
    {
      icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-8 w-8 text-green-600" }),
      label: "Paid",
      value: requests.filter((r) => r.status === "paid").length
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-secondary/30", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-foreground text-background py-12", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-background/20 p-3 rounded-full", children: getRoleIcon() }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold", children: [
          "Welcome, ",
          profile?.name || user.email,
          "!"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "opacity-90", children: user.email }),
        /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "mt-2", children: getRoleLabel() })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: stats.map((stat, index) => /* @__PURE__ */ jsx(Card, { className: "shadow-subtle", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-1", children: stat.label }),
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold", children: stat.value })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-secondary p-3 rounded-lg", children: stat.icon })
      ] }) }) }, index)) }),
      /* @__PURE__ */ jsxs(Card, { className: "shadow-subtle", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-6 w-6 text-primary" }),
            "My Service Requests"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Track progress and make payments when services are completed" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: loadingRequests ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) }) : requests.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-16 w-16 text-muted-foreground mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-2", children: "You haven't requested any services yet" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Request a service and pay only after the work is completed." }),
          /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/services"), children: "Browse Services" })
        ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: requests.map((request) => /* @__PURE__ */ jsx(Card, { className: "border", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              getStatusIcon(request.status),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: request.services?.name || request.service_id }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground flex items-center gap-1 mt-1", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
                  "Requested on",
                  " ",
                  new Date(request.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })
                ] })
              ] })
            ] }),
            getStatusBadge(request.status)
          ] }),
          /* @__PURE__ */ jsx(ServiceStatusStepper, { status: request.status, className: "mb-4" }),
          request.status !== "cancelled" && request.status !== "paid" && /* @__PURE__ */ jsxs("div", { className: "space-y-2 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Progress" }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                request.progress,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx(Progress, { value: request.progress, className: "h-2" })
          ] }),
          request.notes && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-secondary rounded-lg mb-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold mb-2", children: "Notes from your CA:" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: request.notes })
          ] }),
          request.document_url && /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => handleDownloadDocument(request.document_url),
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
                "Download Documents"
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "mb-4 p-4 rounded-lg border border-border/50 bg-secondary/20", children: /* @__PURE__ */ jsx(
            ClientDocumentUpload,
            {
              serviceRequestId: request.id,
              status: request.status
            }
          ) }),
          /* @__PURE__ */ jsx(
            ServicePaymentButton,
            {
              serviceRequestId: request.id,
              serviceName: request.services?.name || request.service_id,
              amount: request.amount,
              status: request.status,
              onPaymentSuccess: () => fetchServiceRequests(user.id)
            }
          )
        ] }) }, request.id)) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs(Card, { className: "shadow-subtle", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Need Help?" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Get in touch with our support team" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/contact"), variant: "outline", className: "w-full", children: "Contact Support" }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "shadow-subtle", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Request More Services" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Explore our comprehensive service offerings" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/services"), variant: "outline", className: "w-full", children: "Browse Services" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ChatbotWidget, { role })
  ] });
}

export {
  Dashboard as default
};
