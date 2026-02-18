import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FileText,
  Trash2,
  Loader2,
  CheckCircle,
  Clock,
  Paperclip
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
function ClientDocumentUpload({ serviceRequestId, status }) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState("");
  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("client_documents").select("id, file_name, file_path, file_size, mime_type, notes, reviewed, created_at").eq("service_request_id", serviceRequestId).eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }, [serviceRequestId, user]);
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  const handleUpload = async (event) => {
    if (!user || !event.target.files?.[0]) return;
    const file = event.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }
    setUploading(true);
    try {
      const filePath = `${user.id}/${serviceRequestId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("client-uploads").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { error: insertError } = await supabase.from("client_documents").insert({
        service_request_id: serviceRequestId,
        user_id: user.id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        notes: note || null
      });
      if (insertError) throw insertError;
      toast.success("Document uploaded successfully");
      setNote("");
      fetchDocuments();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
  const handleDelete = async (doc) => {
    try {
      await supabase.storage.from("client-uploads").remove([doc.file_path]);
      const { error } = await supabase.from("client_documents").delete().eq("id", doc.id);
      if (error) throw error;
      toast.success("Document removed");
      fetchDocuments();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove document");
    }
  };
  const isPaid = status === "paid";
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-4 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
      "Loading documents..."
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
      /* @__PURE__ */ jsx(Paperclip, { className: "w-4 h-4" }),
      "Your Documents (",
      documents.length,
      ")"
    ] }),
    !isPaid && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(
        Textarea,
        {
          placeholder: "Add a note about this document (optional)...",
          value: note,
          onChange: (e) => setNote(e.target.value),
          rows: 2,
          className: "text-sm"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("label", { className: "flex-1", children: /* @__PURE__ */ jsx(
          Input,
          {
            type: "file",
            onChange: handleUpload,
            disabled: uploading,
            accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip",
            className: "cursor-pointer"
          }
        ) }),
        uploading && /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin text-muted-foreground" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Max 10MB. Accepted: PDF, DOC, XLS, JPG, PNG, ZIP" })
    ] }),
    documents.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground py-2", children: "No documents uploaded yet. Upload required documents for your CA to review." }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: documents.map((doc) => /* @__PURE__ */ jsxs(
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
            ] }) : /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "gap-1 text-xs", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
              "Pending"
            ] }),
            !doc.reviewed && !isPaid && /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7",
                onClick: () => handleDelete(doc),
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5 text-destructive" })
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
  ClientDocumentUpload
};
