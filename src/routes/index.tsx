import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-flowiq.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flow IQ — AI Workplace Productivity Assistant" },
      { name: "description", content: "Flow IQ is your AI workplace productivity assistant for emails, meetings, planning, and research." },
      { property: "og:title", content: "Flow IQ — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Automate daily work tasks with Flow IQ." },
    ],
  }),
  component: Index,
});

const features = [
  { url: "/email", icon: Mail, title: "Smart Email Generator", desc: "Compose polished emails with tone and audience tuning." },
  { url: "/meetings", icon: FileText, title: "Meeting Notes Summarizer", desc: "Extract key points, action items, and deadlines." },
  { url: "/tasks", icon: ListChecks, title: "AI Task Planner", desc: "Prioritize and schedule your day intelligently." },
  { url: "/research", icon: Search, title: "AI Research Assistant", desc: "Insights and summaries on any topic in seconds." },
  { url: "/chat", icon: MessageSquare, title: "AI Chatbot", desc: "Conversational assistant for any work task." },
] as const;

function Index() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="rounded-2xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)] mb-10 relative overflow-hidden grid md:grid-cols-2 gap-0">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl pointer-events-none" />
        <div className="relative p-8 md:p-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3 w-3" /> Powered by AI
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Meet Flow IQ
          </h1>
          <p className="mt-2 text-base md:text-lg font-medium text-primary-foreground/90">
            Your AI workplace productivity assistant
          </p>
          <p className="mt-3 text-primary-foreground/80 max-w-xl">
            Automate emails, meetings, planning, and research — all from one calm, focused workspace.
          </p>
        </div>
        <div className="relative min-h-[220px] md:min-h-0">
          <img
            src={heroImage}
            alt="Professional using Flow IQ on her laptop in a modern office"
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover md:rounded-r-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent md:from-primary/30 pointer-events-none" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Link to={f.url} key={f.url}>
            <Card className="p-5 h-full hover:shadow-[var(--shadow-elegant)] hover:border-primary/30 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-secondary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
              <div className="font-semibold text-foreground">{f.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        AI-generated content may require human review.
      </p>
    </div>
  );
}
