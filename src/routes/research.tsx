import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Search, Wand2 } from "lucide-react";
import { researchTopic } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — WorkflowAI" }, { name: "description", content: "Get insights and summaries on any topic." }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null); setOut("");
    try {
      const r = await fn({ data: { topic } });
      setOut(r.text);
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }

  const examples = ["Trends in remote work 2025", "Best practices for OKRs", "Competitive landscape for AI note-takers"];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <PageHeader icon={Search} title="AI Research Assistant" description="Quickly understand any topic with structured insights and next steps." />
      <Card className="p-6 mb-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Topic or question</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. How are companies using AI for customer support?" required minLength={2} />
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button key={ex} type="button" onClick={() => setTopic(ex)} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                {ex}
              </button>
            ))}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            <Wand2 className="h-4 w-4 mr-2" /> {loading ? "Researching..." : "Research Topic"}
          </Button>
        </form>
      </Card>
      <AiOutput text={out} loading={loading} error={err} />
    </div>
  );
}