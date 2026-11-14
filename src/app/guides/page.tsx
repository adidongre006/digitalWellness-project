import { ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GUIDES } from "@/data/guides";

export const metadata = { title: "Student Setup Guides" };

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Learn to Take Control of Your Digital Habits.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Three step-by-step guides, each with real setup instructions, common problems, and official references —
        not just a link to &ldquo;download an app.&rdquo;
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {GUIDES.map((guide) => (
          <Card key={guide.slug} id={guide.slug}>
            <CardContent className="p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold">{guide.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{guide.objective}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {guide.supportedDevices.map((d) => (
                  <Badge key={d} variant="outline">
                    {d}
                  </Badge>
                ))}
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle-foreground">Prerequisites</p>
                <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                  {guide.prerequisites.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden="true">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <Accordion type="single" collapsible className="mt-6">
                {guide.steps.map((step, i) => (
                  <AccordionItem key={step.title} value={`step-${i}`}>
                    <AccordionTrigger>
                      <span className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-accent-soft">
                          {i + 1}
                        </span>
                        {step.title}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-9">{step.body}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-6 rounded-xl border border-success/30 bg-success/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-success">Expected outcome</p>
                <p className="mt-1 text-sm text-foreground">{guide.expectedOutcome}</p>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                  Common problems &amp; troubleshooting
                </p>
                <dl className="mt-2 flex flex-col gap-3">
                  {guide.commonProblems.map((cp) => (
                    <div key={cp.problem}>
                      <dt className="text-sm font-medium text-foreground">{cp.problem}</dt>
                      <dd className="text-sm text-muted-foreground">{cp.fix}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                  Official references
                </p>
                <ul className="mt-2 flex flex-col gap-1">
                  {guide.officialReferences.map((ref) => (
                    <li key={ref.url}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        {ref.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
