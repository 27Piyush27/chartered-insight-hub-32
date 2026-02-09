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
  Download,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useServiceNotifications } from "@/hooks/useServiceNotifications";
import { ServiceStatusStepper } from "@/components/ServiceStatusStepper";
import { ServicePaymentButton } from "@/components/ServicePaymentButton";

interface ServiceRequest {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  progress: number;
  notes: string | null;
  amount: number | null;
  document_url: string | null;
  created_at: string;
  services: {
    name: string;
  } | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, role, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const fetchServiceRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          id, user_id, service_id, status, progress, notes,
          amount, document_url, created_at,
          services (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  // Subscribe to realtime notifications & auto-refresh on changes
  useServiceNotifications(fetchServiceRequests);

  // Load Razorpay script
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

    if (user) {
      fetchServiceRequests();
    }
  }, [user, authLoading, navigate, fetchServiceRequests]);

  const handleDownloadDocument = async (documentUrl: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("service-documents")
        .download(documentUrl);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "paid":
        return <CreditCard className="h-5 w-5 text-green-600" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      completed: { variant: "default", label: "COMPLETED — READY TO PAY" },
      "in_progress": { variant: "secondary", label: "IN PROGRESS" },
      "in-progress": { variant: "secondary", label: "IN PROGRESS" },
      pending: { variant: "outline", label: "PENDING" },
      paid: { variant: "default", label: "PAID" },
      cancelled: { variant: "destructive", label: "CANCELLED" },
    };

    const c = config[status] || { variant: "outline" as const, label: status.toUpperCase() };
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return <Shield className="h-8 w-8" />;
      case "ca":
        return <Briefcase className="h-8 w-8" />;
      default:
        return <User className="h-8 w-8" />;
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
      icon: <FileText className="h-8 w-8 text-primary" />,
      label: "Total Services",
      value: requests.length,
    },
    {
      icon: <Clock className="h-8 w-8 text-yellow-500" />,
      label: "In Progress",
      value: requests.filter((r) => r.status === "in_progress" || r.status === "in-progress").length,
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      label: "Ready to Pay",
      value: requests.filter((r) => r.status === "completed").length,
    },
    {
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      label: "Paid",
      value: requests.filter((r) => r.status === "paid").length,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-background/20 p-3 rounded-full">
              {getRoleIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome, {profile?.name || user.email}!</h1>
              <p className="opacity-90">{user.email}</p>
              <Badge variant="secondary" className="mt-2">
                {getRoleLabel()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-subtle">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="bg-secondary p-3 rounded-lg">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Requests */}
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              My Service Requests
            </CardTitle>
            <CardDescription>Track progress and make payments when services are completed</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRequests ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">You haven't requested any services yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Request a service and pay only after the work is completed.
                </p>
                <Button onClick={() => navigate("/services")}>Browse Services</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id} className="border">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(request.status)}
                          <div>
                            <h3 className="font-semibold text-lg">
                              {request.services?.name || request.service_id}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="h-4 w-4" />
                              Requested on{" "}
                              {new Date(request.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      {/* Status Stepper */}
                      <ServiceStatusStepper status={request.status} className="mb-4" />

                      {/* Progress Bar */}
                      {request.status !== "cancelled" && request.status !== "paid" && (
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{request.progress}%</span>
                          </div>
                          <Progress value={request.progress} className="h-2" />
                        </div>
                      )}

                      {/* Notes from CA */}
                      {request.notes && (
                        <div className="p-4 bg-secondary rounded-lg mb-4">
                          <p className="text-sm font-semibold mb-2">Notes from your CA:</p>
                          <p className="text-sm text-muted-foreground">{request.notes}</p>
                        </div>
                      )}

                      {/* Document Download */}
                      {request.document_url && (
                        <div className="mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocument(request.document_url!)}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Documents
                          </Button>
                        </div>
                      )}

                      {/* Conditional Payment Button */}
                      <ServicePaymentButton
                        serviceRequestId={request.id}
                        serviceName={request.services?.name || request.service_id}
                        amount={request.amount}
                        status={request.status}
                        onPaymentSuccess={fetchServiceRequests}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/contact")} variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Request More Services</CardTitle>
              <CardDescription>Explore our comprehensive service offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/services")} variant="outline" className="w-full">
                Browse Services
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
