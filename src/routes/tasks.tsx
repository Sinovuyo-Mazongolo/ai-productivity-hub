import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListChecks, Wand2 } from "lucide-react";
import { planTasks } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — WorkflowAI" }, { name: "description", content: "Prioritize and schedule your day with AI." }] }),
  component: TasksPage,
});

function TasksPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState(8);
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null); setOut("");
    try {
      const r = await fn({ data: { tasks, hoursAvailable: hours } });
      setOut(r.text);
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader icon={ListChecks} title="AI Task Planner" description="List your tasks and available hours — get a prioritized, time-blocked plan." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Today's tasks (one per line)</Label>
              <Textarea value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"Finish Q4 report\nReply to client emails\n1:1 with Sarah\nReview pull requests"} rows={10} required />
            </div>
            <div className="space-y-1.5">
              <Label>Hours available</Label>
              <Input type="number" min={1} max={24} value={hours} onChange={(e) => setHours(Number(e.target.value))} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4 mr-2" /> {loading ? "Planning..." : "Plan My Day"}
            </Button>
          </form>
        </Card>
        <div>
          <AiOutput text={out} loading={loading} error={err} />
          {!out && !loading && !err && (
            <Card className="p-10 text-center text-sm text-muted-foreground border-dashed h-full">
              Your prioritized schedule will appear here.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}