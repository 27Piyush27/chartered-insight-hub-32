import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FileText,
  Download,
  CheckCircle,
  Loader2,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
function CADocumentReview({ serviceRequestId, clientName }) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const fetchDocuments = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("client_documents").select("id, file_name, file_path, file_size, mime_type, notes, reviewed, reviewed_at, created_at, user_id").eq("service_request_id", serviceRequestId).order("created_at", { ascending: false });
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching client documents:", error);
    } finally {
      setLoading(false);
    }
  }, [serviceRequestId]);
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  const handleDownload = async (doc) => {
    try {
      const { data, error } = await supabase.storage.from("client-uploads").download(doc.file_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };
  const handleMarkReviewed = async (docId) => {
    if (!user) return;
    setReviewingId(docId);
    try {
      const { error } = await supabase.from("client_documents").update({
        reviewed: true,
        reviewed_by: user.id,
        reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", docId);
      if (error) throw error;
      toast.success("Document marked as reviewed");
      fetchDocuments();
    } catch (error) {
      console.error("Review error:", error);
      toast.error("Failed to update review status");
    } finally {
      setReviewingId(null);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-3 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
      "Loading client documents..."
    ] });
  }
  if (documents.length === 0) {
    return /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground py-2", children: [
      "No documents uploaded by ",
      clientName || "the client",
      " yet."
    ] });
  }
  const reviewed = documents.filter((d) => d.reviewed).length;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }),
        "Client Documents (",
        documents.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs", children: [
        reviewed,
        "/",
        documents.length,
        " reviewed"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-60 overflow-y-auto", children: documents.map((doc) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center justify-between gap-3 p-3 rounded-lg border border-border/50 bg-secondary/30",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 flex-shrink-0 text-muted-foreground" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: doc.file_name }),
              doc.notes && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: doc.notes }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                new Date(doc.created_at).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric"
                }),
                doc.file_size && ` \xB7 ${(doc.file_size / 1024).toFixed(0)} KB`
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
            doc.reviewed ? /* @__PURE__ */ jsxs(Badge, { variant: "default", className: "gap-1 text-xs", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3" }),
              "Reviewed"
            ] }) : /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "text-xs h-7",
                onClick: () => handleMarkReviewed(doc.id),
                disabled: reviewingId === doc.id,
                children: reviewingId === doc.id ? /* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "w-3 h-3 mr-1" }),
                  "Mark Reviewed"
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7",
                onClick: () => handleDownload(doc),
                children: /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" })
              }
            )
          ] })
        ]
      },
      doc.id
    )) })
  ] });
}
export {
  CADocumentReview
};
