import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, CalendarCheck, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RESOURCES, CATEGORY_LABELS, getResourceBySlug } from "@/data/resources";

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

// Next.js 16 passes `params` as a Promise to both generateMetadata and the
// page component itself (the dynamic-APIs change introduced in Next.js 15
// and carried forward) — both are awaited explicitly rather than accessed
// synchronously.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) return {};
  return { title: resource.name, description: resource.purpose };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

  const verifiedDate = new Date(resource.verifiedOn).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/resources" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All resources
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{CATEGORY_LABELS[resource.category]}</Badge>
        <Badge variant={resource.pricing === "Free" || resource.pricing === "Open Source" ? "success" : "default"}>
          {resource.pricing}
        </Badge>
        {resource.openSource && <Badge variant="primary">Open Source</Badge>}
      </div>

      <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{resource.name}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{resource.purpose}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <a href={resource.officialWebsite} target="_blank" rel="noopener noreferrer">
            Official website <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a href={resource.officialDocsUrl} target="_blank" rel="noopener noreferrer">
            Documentation <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-subtle-foreground">
        <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" /> Last verified {verifiedDate}
      </p>

      <Section title="What it does">
        <p>{resource.description}</p>
      </Section>

      <Section title="Supported platforms">
        <div className="flex flex-wrap gap-2">
          {resource.platforms.map((p) => (
            <Badge key={p} variant="outline">
              {p}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Pricing">
        <p>{resource.freeFunctionality}</p>
        {resource.paidRestrictions && <p className="mt-2">{resource.paidRestrictions}</p>}
      </Section>

      <Section title="Privacy">
        <p>{resource.privacyInfo}</p>
        <p className="mt-2 text-sm text-subtle-foreground">{resource.dataCollection}</p>
        {resource.privacyPolicyUrl && (
          <a
            href={resource.privacyPolicyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Read the privacy policy <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </Section>

      <Section title="Accessibility">
        <p>{resource.accessibilityNotes}</p>
      </Section>

      <Section title="Limitations">
        <ul className="flex flex-col gap-2">
          {resource.limitations.map((l) => (
            <li key={l} className="flex gap-2 text-sm">
              <span aria-hidden="true">•</span>
              {l}
            </li>
          ))}
        </ul>
      </Section>

      <Card className="mt-10">
        <CardContent className="p-6">
          <p className="text-sm font-semibold text-foreground">Want a tool matched to your exact situation?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run the assessment to compare {resource.name} against the other resources in this category.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/assessment">Take the assessment</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
