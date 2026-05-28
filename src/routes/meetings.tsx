import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Wand2 } from "lucide-react";
import { summarizeMeeting } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — WorkflowAI" }, { name: "description", content: "Turn raw meeting notes into summaries, action items and deadlines." }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null); setOut("");
    try {
      const r = await fn({ data: { notes } });
      setOut(r.text);
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader icon={FileText} title="Meeting Notes Summarizer" description="Paste raw notes or a transcript and get key points, action items, and deadlines." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Meeting notes or transcript</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste raw notes here..." rows={14} required minLength={10} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4 mr-2" /> {loading ? "Summarizing..." : "Summarize Meeting"}
            </Button>
          </form>
        </Card>
        <div>
          <AiOutput text={out} loading={loading} error={err} />
          {!out && !loading && !err && (
            <Card className="p-10 text-center text-sm text-muted-foreground border-dashed h-full">
              Your structured summary will appear here.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}