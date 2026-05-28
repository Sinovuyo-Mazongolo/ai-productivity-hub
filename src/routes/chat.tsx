import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — WorkflowAI" }, { name: "description", content: "Conversational AI assistant for work tasks." }] }),
  component: ChatPage,
});

const STORAGE_KEY = "workflowai_chat_messages_v1";

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function ChatPage() {
  const [initial] = useState<UIMessage[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message || "Chat error"),
  });

  // Persist messages on every change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Focus textarea
  useEffect(() => { textareaRef.current?.focus(); }, [status]);

  const isLoading = status === "submitted" || status === "streaming";

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  }

  function clearChat() {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Conversation cleared");
  }

  const suggestions = [
    "Draft a status update for my team",
    "Help me prepare for a 1:1 with my manager",
    "Summarize the key parts of a PRD",
    "What's a good agenda for a kickoff meeting?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="p-6 md:px-10 md:pt-10 max-w-4xl w-full mx-auto">
        <div className="flex items-start justify-between gap-4">
          <PageHeader icon={MessageSquare} title="AI Chatbot" description="Ask anything related to your work — drafting, summarizing, brainstorming." />
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat}>
              <Trash2 className="h-4 w-4 mr-1.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 md:px-10 pb-6 space-y-6">
          {messages.length === 0 && (
            <Card className="p-8 border-dashed">
              <div className="text-center text-muted-foreground text-sm mb-5">
                Start a conversation, or try a prompt:
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="text-left text-sm p-3 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center ${isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                  {isUser ? <User className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] ${isUser ? "" : "flex-1"}`}>
                  {isUser ? (
                    <div className="inline-block rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap">
                      {text}
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-p:my-2">
                      <ReactMarkdown>{text || "…"}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex gap-3">
              <div className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center bg-accent text-accent-foreground">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="text-sm text-muted-foreground animate-pulse">Thinking…</div>
            </div>
          )}
          {error && (
            <div className="text-sm text-destructive">Error: {error.message}</div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card/60 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-4">
          <form onSubmit={submit} className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
              }}
              placeholder="Message the AI assistant…"
              rows={1}
              className="resize-none min-h-[44px] max-h-40"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="h-11 w-11 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-[11px] text-muted-foreground text-center">
            AI-generated content may require human review.
          </p>
        </div>
      </div>
    </div>
  );
}