import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Wand2 } from "lucide-react";
import { generateEmail } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — WorkflowAI" }, { name: "description", content: "Generate professional emails by tone and audience." }] }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Professional");
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null); setOut("");
    try {
      const r = await fn({ data: { recipient, tone, purpose, context } });
      setOut(r.text);
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed to generate"); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader icon={Mail} title="Smart Email Generator" description="Draft a clear, professional email tuned to your audience and tone." />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2 h-fit">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Recipient / Audience</Label>
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Hiring manager at Acme Corp" required />
            </div>
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Professional","Friendly","Formal","Persuasive","Apologetic","Concise","Enthusiastic"].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Purpose</Label>
              <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Follow up on Tuesday's proposal" required />
            </div>
            <div className="space-y-1.5">
              <Label>Additional context (optional)</Label>
              <Textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="Key points, deadlines, names to reference..." rows={4} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <Wand2 className="h-4 w-4 mr-2" /> {loading ? "Generating..." : "Generate Email"}
            </Button>
          </form>
        </Card>
        <div className="lg:col-span-3">
          <AiOutput text={out} loading={loading} error={err} />
          {!out && !loading && !err && (
            <Card className="p-10 text-center text-sm text-muted-foreground border-dashed">
              Your generated email will appear here.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}