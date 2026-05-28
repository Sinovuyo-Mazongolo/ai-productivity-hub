import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

export function AiOutput({ text, loading, error }: { text?: string; loading?: boolean; error?: string | null }) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <Card className="p-6 space-y-3 animate-pulse">
        <div className="h-3 w-1/3 bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-5/6 bg-muted rounded" />
        <div className="h-3 w-4/6 bg-muted rounded" />
      </Card>
    );
  }
  if (error) {
    return (
      <Card className="p-6 border-destructive/40 bg-destructive/5">
        <div className="flex gap-2 items-start text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <div>{error}</div>
        </div>
      </Card>
    );
  }
  if (!text) return null;

  return (
    <Card className="p-6 relative shadow-[var(--shadow-card)]">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-3 top-3"
        onClick={() => {
          navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-headings:font-semibold prose-headings:tracking-tight">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
      <p className="mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground">
        AI-generated content may require human review.
      </p>
    </Card>
  );
}