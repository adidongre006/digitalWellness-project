import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "About This Project" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">About this project</h1>
      <p className="mt-4 text-muted-foreground">
        The Digital Wellness Resource Hub is an academic software engineering project. It helps university
        students discover, evaluate, compare, and configure digital wellness tools — not by handing over a
        generic app-store list, but by explaining what each tool actually does, who it suits, and what it
        doesn&apos;t do.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <InfoCard title="Why this exists">
          Screen time, doomscrolling, poor sleep, trouble concentrating, notification overload, and online
          privacy are five of the most common digital-wellbeing complaints students report. Most existing
          roundups either list tools without explaining trade-offs, or recommend a single paid product. This
          project aims to do neither.
        </InfoCard>
        <InfoCard title="What makes it different">
          Every one of the ten resources in the catalog is checked against its own official source — pricing
          page, support documentation, or privacy policy — with the verification date shown on its detail page.
          Nothing is invented, and limitations are stated as plainly as benefits.
        </InfoCard>
        <InfoCard title="How recommendations work">
          The assessment, the comparison table, and the AI chatbot all read from the same ten-resource catalog
          stored in the project&apos;s Neon PostgreSQL database — there is no separate, inconsistent list hiding
          inside the chatbot.
        </InfoCard>
        <InfoCard title="Academic context">
          Built to be suitable for a final-year engineering project demonstration, a professional portfolio
          piece, and real use by students, with accompanying documentation in the project&apos;s <code>docs/</code>
          folder covering methodology, testing, and accessibility.
        </InfoCard>
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{children}</p>
      </CardContent>
    </Card>
  );
}
