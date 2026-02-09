import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";

interface ServiceRequestRow {
  id: string;
  user_id: string;
  service_id: string;
  status: string;
  progress: number;
  notes: string | null;
  assigned_ca: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  in_progress: "In Progress",
  completed: "Completed",
  paid: "Paid",
  cancelled: "Cancelled",
};

const STATUS_MESSAGES: Record<string, { title: string; description: string }> = {
  "in-progress": {
    title: "🚀 Service Started",
    description: "Your service request is now being worked on by our CA team.",
  },
  in_progress: {
    title: "🚀 Service Started",
    description: "Your service request is now being worked on by our CA team.",
  },
  completed: {
    title: "✅ Service Completed — Payment Available",
    description: "Your service is completed! You can now make the payment from your dashboard.",
  },
  paid: {
    title: "💳 Payment Confirmed",
    description: "Your payment has been received. Thank you!",
  },
  cancelled: {
    title: "❌ Service Cancelled",
    description: "Your service request has been cancelled.",
  },
};

export function useServiceNotifications(onUpdate?: () => void) {
  const { user } = useAuth();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const handleUpdate = useCallback(
    (payload: RealtimePostgresUpdatePayload<ServiceRequestRow>) => {
      const newRow = payload.new;
      const oldRow = payload.old as Partial<ServiceRequestRow>;

      // Only notify if status actually changed
      if (oldRow.status && newRow.status !== oldRow.status) {
        const message = STATUS_MESSAGES[newRow.status];
        if (message) {
          toast({
            title: message.title,
            description: message.description,
          });
        } else {
          toast({
            title: "📋 Status Updated",
            description: `Your service request status changed to ${STATUS_LABELS[newRow.status] || newRow.status}.`,
          });
        }
      }

      // Notify on progress change
      if (
        oldRow.progress !== undefined &&
        newRow.progress !== oldRow.progress &&
        newRow.status !== "cancelled"
      ) {
        if (newRow.progress === 100 && newRow.status !== "completed") {
          toast({
            title: "📊 Progress Complete",
            description: "Your service is 100% complete and awaiting final review.",
          });
        } else if (newRow.progress > 0 && newRow.progress < 100) {
          // Only notify at meaningful milestones (25%, 50%, 75%)
          if ([25, 50, 75].includes(newRow.progress)) {
            toast({
              title: "📊 Progress Update",
              description: `Your service request is now ${newRow.progress}% complete.`,
            });
          }
        }
      }

      // Notify when notes are added
      if (oldRow.notes !== newRow.notes && newRow.notes && !oldRow.notes) {
        toast({
          title: "💬 New Note Added",
          description: "Your CA has added a note to your service request.",
        });
      }

      // Trigger the callback to refresh data
      onUpdate?.();
    },
    [onUpdate]
  );

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`service-requests-${user.id}`)
      .on<ServiceRequestRow>(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "service_requests",
          filter: `user_id=eq.${user.id}`,
        },
        handleUpdate
      )
      .on<ServiceRequestRow>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "service_requests",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          toast({
            title: "📝 New Service Request",
            description: "A new service request has been created for your account.",
          });
          onUpdate?.();
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, handleUpdate, onUpdate]);
}
