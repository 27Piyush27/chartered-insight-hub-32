import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Shield,
  Briefcase,
  Clock,
  CheckCircle,
  FileText,
  Loader2,
  Users,
  IndianRupee,
  Send,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ServiceStatusStepper } from "@/components/ServiceStatusStepper";
import { CADocumentReview } from "@/components/CADocumentReview";
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" }
];
function AdminDashboard() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateProgress, setUpdateProgress] = useState("");
  const [updateAmount, setUpdateAmount] = useState("");
  const [updateNotes, setUpdateNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const fetchRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("service_requests").select(`
          id, user_id, service_id, status, progress, notes,
          amount, document_url, assigned_ca, created_at, updated_at,
          services (name)
        `).order("created_at", { ascending: false });
      if (error) throw error;
      const userIds = [...new Set((data || []).map((r) => r.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, name, email, phone").in("user_id", userIds);
      const profileMap = new Map(
        (profiles || []).map((p) => [p.user_id, p])
      );
      const enriched = (data || []).map((r) => ({
        ...r,
        profiles: profileMap.get(r.user_id) || null
      }));
      setRequests(enriched);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load service requests");
    } finally {
      setLoadingRequests(false);
    }
  }, []);
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!authLoading && role !== "admin" && role !== "ca") {
      toast.error("Access denied. Admin or CA role required.");
      navigate("/dashboard");
      return;
    }
    if (user) {
      fetchRequests();
    }
  }, [user, role, authLoading, navigate, fetchRequests]);
  const openManageDialog = (request) => {
    setSelectedRequest(request);
    setUpdateStatus(request.status);
    setUpdateProgress(String(request.progress));
    setUpdateAmount(request.amount ? String(request.amount) : "");
    setUpdateNotes(request.notes || "");
    setDialogOpen(true);
  };
  const handleSaveUpdate = async () => {
    if (!selectedRequest) return;
    setSaving(true);
    try {
      const updates = {
        status: updateStatus,
        progress: parseInt(updateProgress) || 0,
        notes: updateNotes || null
      };
      if (updateAmount) {
        updates.amount = parseFloat(updateAmount);
      }
      if (updateStatus === "completed" && !updateAmount) {
        toast.error("Please set the final amount before marking as completed");
        setSaving(false);
        return;
      }
      if (updateStatus === "completed") {
        updates.progress = 100;
      }
      const { error } = await supabase.from("service_requests").update(updates).eq("id", selectedRequest.id);
      if (error) throw error;
      toast.success(
        updateStatus === "completed" ? "Service marked as completed. Client has been notified and can now make payment." : "Service request updated successfully"
      );
      setDialogOpen(false);
      fetchRequests();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update service request");
    } finally {
      setSaving(false);
    }
  };
  const handleDocumentUpload = async (event) => {
    if (!selectedRequest || !event.target.files?.[0]) return;
    setUploading(true);
    try {
      const file = event.target.files[0];
      const filePath = `${selectedRequest.user_id}/${selectedRequest.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage.from("service-documents").upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("service-documents").getPublicUrl(filePath);
      const { error: updateError } = await supabase.from("service_requests").update({ document_url: filePath }).eq("id", selectedRequest.id);
      if (updateError) throw updateError;
      toast.success("Document uploaded successfully");
      setSelectedRequest({ ...selectedRequest, document_url: filePath });
      fetchRequests();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };
  const handleAssignToMe = async (requestId) => {
    try {
      const { error } = await supabase.from("service_requests").update({ assigned_ca: user.id }).eq("id", requestId);
      if (error) throw error;
      toast.success("Request assigned to you");
      fetchRequests();
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error("Failed to assign request");
    }
  };
  const getStatusBadge = (status) => {
    const config = {
      pending: { variant: "outline", label: "Pending" },
      in_progress: { variant: "secondary", label: "In Progress" },
      "in-progress": { variant: "secondary", label: "In Progress" },
      completed: { variant: "default", label: "Completed" },
      paid: { variant: "default", label: "Paid" },
      cancelled: { variant: "destructive", label: "Cancelled" }
    };
    const c = config[status] || { variant: "outline", label: status };
    return /* @__PURE__ */ jsx(Badge, { variant: c.variant, children: c.label });
  };
  const filteredRequests = requests.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });
  if (authLoading || !user) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-foreground" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx("div", { className: "border-b border-border/50 bg-foreground text-background py-10", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
        role === "admin" ? /* @__PURE__ */ jsx(Shield, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Briefcase, { className: "h-6 w-6" }),
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-semibold tracking-tight", children: [
          role === "admin" ? "Admin" : "CA",
          " Dashboard"
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-background/70", children: "Manage service requests, update statuses, and handle client deliverables." })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 py-8", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4 mb-8", children: [
        { label: "All", count: requests.length, filter: "all" },
        { label: "Pending", count: requests.filter((r) => r.status === "pending").length, filter: "pending" },
        { label: "In Progress", count: requests.filter((r) => r.status === "in_progress" || r.status === "in-progress").length, filter: "in_progress" },
        { label: "Completed", count: requests.filter((r) => r.status === "completed").length, filter: "completed" },
        { label: "Paid", count: requests.filter((r) => r.status === "paid").length, filter: "paid" }
      ].map((stat) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setFilter(stat.filter),
          className: `p-4 rounded-xl border text-left transition-colors ${filter === stat.filter ? "border-foreground bg-foreground text-background" : "border-border/50 hover:border-border"}`,
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-semibold", children: stat.count }),
            /* @__PURE__ */ jsx("p", { className: `text-xs ${filter === stat.filter ? "text-background/70" : "text-muted-foreground"}`, children: stat.label })
          ]
        },
        stat.filter
      )) }),
      loadingRequests ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-foreground" }) }) : filteredRequests.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "py-12 text-center", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No service requests found" })
      ] }) }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredRequests.map((request) => /* @__PURE__ */ jsx(Card, { className: "border-border/50", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: request.services?.name || request.service_id }),
            getStatusBadge(request.status),
            request.status === "paid" && /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-green-600 border-green-200", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3 mr-1" }),
              "Payment Received"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5" }),
              request.profiles?.name || "Unknown Client",
              " (",
              request.profiles?.email || "",
              ")"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
              new Date(request.created_at).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })
            ] }),
            request.amount && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(IndianRupee, { className: "w-3.5 h-3.5" }),
              "\u20B9",
              request.amount.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsx(ServiceStatusStepper, { status: request.status }),
          request.progress > 0 && request.status !== "paid" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 max-w-sm", children: [
            /* @__PURE__ */ jsx(Progress, { value: request.progress, className: "h-1.5 flex-1" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
              request.progress,
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          !request.assigned_ca && role === "ca" && /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => handleAssignToMe(request.id),
              children: "Assign to Me"
            }
          ),
          request.status !== "paid" && /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => openManageDialog(request), children: [
            /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 mr-1" }),
            "Manage"
          ] })
        ] })
      ] }) }) }, request.id)) }),
      /* @__PURE__ */ jsx(Dialog, { open: dialogOpen, onOpenChange: (open) => {
        if (!open) setDialogOpen(false);
      }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg max-h-[85vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxs(DialogTitle, { children: [
            "Manage: ",
            selectedRequest?.services?.name || selectedRequest?.service_id
          ] }),
          /* @__PURE__ */ jsxs(DialogDescription, { children: [
            "Client: ",
            selectedRequest?.profiles?.name,
            " (",
            selectedRequest?.profiles?.email,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Status" }),
            /* @__PURE__ */ jsxs(Select, { value: updateStatus, onValueChange: setUpdateStatus, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsx(SelectContent, { children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Progress (%)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                min: "0",
                max: "100",
                value: updateProgress,
                onChange: (e) => setUpdateProgress(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Final Amount (\u20B9)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "number",
                min: "0",
                placeholder: "Set the final billable amount",
                value: updateAmount,
                onChange: (e) => setUpdateAmount(e.target.value)
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Required before marking as completed. Client will be charged this amount + 18% GST." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Notes for Client" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                placeholder: "Add notes visible to the client...",
                value: updateNotes,
                onChange: (e) => setUpdateNotes(e.target.value),
                rows: 3
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          selectedRequest && /* @__PURE__ */ jsx(
            CADocumentReview,
            {
              serviceRequestId: selectedRequest.id,
              clientName: selectedRequest.profiles?.name
            }
          ),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { children: "Upload Final Documents" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "file",
                  onChange: handleDocumentUpload,
                  disabled: uploading,
                  accept: ".pdf,.doc,.docx,.xls,.xlsx,.zip"
                }
              ),
              uploading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" })
            ] }),
            selectedRequest?.document_url && /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }),
              "Document uploaded"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Separator, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancel" }),
            /* @__PURE__ */ jsxs(Button, { onClick: handleSaveUpdate, disabled: saving, children: [
              saving ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 mr-2" }),
              updateStatus === "completed" ? "Complete & Notify Client" : "Save Changes"
            ] })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  AdminDashboard as default
};
