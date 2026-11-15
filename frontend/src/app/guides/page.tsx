
import Image from "next/image";

import {
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Clock,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { GUIDES } from "@/data/guides";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Student Setup Guides",
  description:
    "Practical digital wellness setup guides for students.",
};

export default function GuidesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">

      {/* Page Header */}
      <header>
        <Badge variant="outline" className="mb-5 gap-2">
          <BookOpen className="h-3.5 w-3.5" />
          Student Resources
        </Badge>

        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Learn to Take Control of Your Digital Habits.
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Three step-by-step guides, each with practical setup
          instructions, common problems, and official references —
          not just a link to download an app.
        </p>
      </header>

      {/* All Guides */}
      <div className="mt-10 flex flex-col gap-8">

        {GUIDES.map((guide, index) => (

          <Card
            key={guide.slug}
            id={guide.slug}
            className="overflow-hidden rounded-2xl"
          >
            <CardContent className="p-6 sm:p-8">

              {/* Guide Title */}
              <div>
                <Badge variant="primary">
                  Guide {index + 1}
                </Badge>

                <h2 className="mt-4 font-display text-xl font-semibold">
                  {guide.title}
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {guide.objective}
                </p>
              </div>

              {/* ONE IMAGE FOR THE ENTIRE GUIDE SECTION */}
              <div className="relative mt-6 w-full overflow-hidden rounded-xl border bg-muted">

                <Image
                  src={guide.image}
                  alt={guide.imageAlt}
                  width={1200}
                  height={675}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="h-auto max-h-105 w-full object-cover"
                  priority={index === 0}
                />

              </div>

              {/* Supported Devices */}
              <div className="mt-5 flex flex-wrap gap-2">
                {guide.supportedDevices.map((device) => (
                  <Badge key={device} variant="outline">
                    {device}
                  </Badge>
                ))}
              </div>

              {/* Prerequisites */}
              <section className="mt-6">

                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Prerequisites
                </h3>

                <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
                  {guide.prerequisites.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true">•</span>
                      {item}
                    </li>
                  ))}
                </ul>

              </section>

              {/* Accordion Steps */}
              <section className="mt-7">

                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Step-by-step instructions
                  </h3>

                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {guide.steps.length} steps
                  </span>
                </div>

                <Accordion type="single" collapsible className="w-full">

                  {guide.steps.map((step, i) => (
                    <AccordionItem
                      key={step.title}
                      value={`step-${i}`}
                    >

                      <AccordionTrigger>
                        <span className="flex items-center gap-3 text-left">

                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {i + 1}
                          </span>

                          <span>{step.title}</span>

                        </span>
                      </AccordionTrigger>

                      <AccordionContent className="pl-10 text-sm leading-7 text-muted-foreground">
                        {step.body}
                      </AccordionContent>

                    </AccordionItem>
                  ))}

                </Accordion>

              </section>

              {/* Expected Outcome */}
              <section className="mt-7 rounded-xl border border-success/30 bg-success/10 p-4">

                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-success">
                  <ShieldCheck className="h-4 w-4" />
                  Expected Outcome
                </h3>

                <p className="mt-2 text-sm leading-6 text-foreground">
                  {guide.expectedOutcome}
                </p>

              </section>

              {/* Troubleshooting */}
              <section className="mt-7">

                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Common Problems & Troubleshooting
                </h3>

                <dl className="mt-3 flex flex-col gap-4">

                  {guide.commonProblems.map((problem) => (
                    <div key={problem.problem}>

                      <dt className="text-sm font-medium text-foreground">
                        {problem.problem}
                      </dt>

                      <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                        {problem.fix}
                      </dd>

                    </div>
                  ))}

                </dl>

              </section>

              {/* Official References */}
              <section className="mt-7">

                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Official References
                </h3>

                <ul className="mt-3 flex flex-col gap-3">

                  {guide.officialReferences.map((ref) => (
                    <li key={ref.url}>

                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        {ref.label}

                        <ExternalLink
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      </a>

                    </li>
                  ))}

                </ul>

              </section>

            </CardContent>
          </Card>

        ))}

      </div>

    </main>
  );
}

















// import { ExternalLink } from "lucide-react";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { GUIDES } from "@/data/guides";
// import Image from "next/image";

// export const metadata = { title: "Student Setup Guides" };

// export default function GuidesPage() {
//   return (
//     <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
//       <h1 className="font-display text-3xl font-semibold sm:text-4xl">Learn to Take Control of Your Digital Habits.</h1>
//       <p className="mt-3 max-w-2xl text-muted-foreground">
//         Three step-by-step guides, each with real setup instructions, common problems, and official references —
//         not just a link to &ldquo;download an app.&rdquo;
//       </p>

//       <div className="mt-10 flex flex-col gap-8">
//         {GUIDES.map((guide) => (
//           <Card key={guide.slug} id={guide.slug}>
//                 <Image

//                 alt="greenheart"
//                 src={guide.image}
//                 width={200}
//                 height={200}
//                 />
//             <CardContent className="p-6 sm:p-8">
//               <h2 className="font-display text-xl font-semibold">{guide.title}</h2>
//               <p className="mt-2 text-sm text-muted-foreground">{guide.objective}</p>

//               <div className="mt-4 flex flex-wrap gap-2">
//                 {guide.supportedDevices.map((d) => (
//                   <Badge key={d} variant="outline">
//                     {d}
//                   </Badge>
//                 ))}
//               </div>

//               <div className="mt-5">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-subtle-foreground">Prerequisites</p>
//                 <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
//                   {guide.prerequisites.map((p) => (
//                     <li key={p} className="flex gap-2">
//                       <span aria-hidden="true">•</span>
//                       {p}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <Accordion type="single" collapsible className="mt-6">
//                 {guide.steps.map((step, i) => (
//                   <AccordionItem key={step.title} value={`step-${i}`}>
               
//                     <AccordionTrigger>
//                       <span className="flex items-center gap-3">
//                         <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-accent-soft">
//                           {i + 1}
//                         </span>
//                         {step.title}
//                       </span>
               
                    
                     
//                     </AccordionTrigger>
               
//                     <AccordionContent className="pl-9">{step.body}</AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </Accordion>

//               <div className="mt-6 rounded-xl border border-success/30 bg-success/10 p-4">
               
//                 <p className="text-xs font-semibold uppercase tracking-wide text-success">Expected outcome</p>
//                 <p className="mt-1 text-sm text-foreground">{guide.expectedOutcome}</p>
//               </div>

//               <div className="mt-6">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
//                   Common problems &amp; troubleshooting
//                 </p>
//                 <dl className="mt-2 flex flex-col gap-3">
//                   {guide.commonProblems.map((cp) => (
//                     <div key={cp.problem}>
//                       <dt className="text-sm font-medium text-foreground">{cp.problem}</dt>
//                       <dd className="text-sm text-muted-foreground">{cp.fix}</dd>
//                     </div>
//                   ))}
//                 </dl>
//               </div>

//               <div className="mt-6">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
//                   Official references
//                 </p>
//                 <ul className="mt-2 flex flex-col gap-1">
//                   {guide.officialReferences.map((ref) => (
//                     <li key={ref.url}>
//                       <a
//                         href={ref.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
//                       >
//                         {ref.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
