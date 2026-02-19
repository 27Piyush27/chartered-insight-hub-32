import { useState } from "react";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiApi } from "@/lib/api";

const rolePrompts = {
  client: "I can help with service requests, document sharing, and payment steps.",
  ca: "I can help with request management, document review, and completion workflow.",
  admin: "I can help with request management, role controls, and payment workflow.",
};

export function ChatbotWidget({ role = "client" }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: rolePrompts[role] || rolePrompts.client,
    },
  ]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await aiApi.chat(text);
      const botText = response?.message || response?.reply || "Thanks! I received your message.";
      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I’m currently unavailable via server chat. Please continue using dashboard actions (documents, status updates, payments).",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <Card className="w-[340px] shadow-medium border-border/70">
          <CardHeader className="py-3 px-4 border-b border-border/50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <ScrollArea className="h-64 pr-2">
              <div className="space-y-2">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`text-xs rounded-md px-3 py-2 ${
                      m.sender === "user" ? "bg-foreground text-background ml-8" : "bg-secondary mr-8"
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1 opacity-80">
                      {m.sender === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      <span className="uppercase tracking-wide text-[10px]">{m.sender}</span>
                    </div>
                    {m.text}
                  </div>
                ))}
                {loading && (
                  <div className="text-xs rounded-md px-3 py-2 bg-secondary mr-8 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button size="icon" onClick={handleSend} disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button className="rounded-full h-12 w-12 p-0 shadow-soft" onClick={() => setOpen(true)}>
          <MessageCircle className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
