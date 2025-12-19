import { useState, useEffect } from "react";
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
} from "lucide-react";

interface ServiceRequest {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  requestDate: string;
  progress: number;
  updates?: string[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("gmr_current_v5");
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    const userData = JSON.parse(currentUser);
    setUser(userData);

    const allRequests = JSON.parse(localStorage.getItem("gmr_requests_v5") || "[]");
    const userRequests = allRequests.filter((r: ServiceRequest) => r.userId === userData.email);
    setRequests(userRequests);
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: "default",
      "in-progress": "secondary",
      pending: "outline",
      cancelled: "destructive",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    );
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
      value: requests.filter((r) => r.status === "in-progress").length,
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      label: "Completed",
      value: requests.filter((r) => r.status === "completed").length,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
              <p className="opacity-90">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Requests */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              My Service Requests
            </CardTitle>
            <CardDescription>Track the progress of your requested services</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">You haven't requested any services yet</p>
                <Button onClick={() => navigate("/services")}>Browse Services</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(request.status)}
                          <div>
                            <h3 className="font-semibold text-lg">{request.serviceName}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="h-4 w-4" />
                              Requested on{" "}
                              {new Date(request.requestDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      {request.status !== "cancelled" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{request.progress}%</span>
                          </div>
                          <Progress value={request.progress} className="h-2" />
                        </div>
                      )}

                      {request.updates && request.updates.length > 0 && (
                        <div className="mt-4 p-4 bg-secondary rounded-lg">
                          <p className="text-sm font-semibold mb-2">Latest Update:</p>
                          <p className="text-sm text-muted-foreground">
                            {request.updates[request.updates.length - 1]}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Make Payment
              </CardTitle>
              <CardDescription>Pay for services securely via Razorpay</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/payments")} className="w-full">
                Go to Payments
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
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

          <Card className="shadow-card">
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
