export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Privacy</h1>
      <p className="mt-4 text-muted-foreground">
        This page covers two things: what this site itself collects, and how we describe the privacy practices
        of the third-party resources in our catalog.
      </p>

      <Section title="What this site collects">
        <p>
          The assessment runs entirely in your browser — your answers (problem, device, budget) are never sent
          to a server or stored. The chatbot sends your message to our FastAPI backend solely to generate a
          response; by default, conversation history is not persisted beyond what is needed to answer in the
          moment. Your chosen theme preference is stored only in your browser&apos;s local storage.
        </p>
      </Section>

      <Section title="How we describe third-party resources">
        <p>
          Each resource page in our catalog includes a dedicated Privacy section describing, to the best of our
          verification, how that tool handles data — whether it requires an account, whether usage data syncs
          to a third-party server, and whether it is open source. We deliberately do not assume that an
          open-source tool is automatically privacy-safe, and we do not assume that a free tool is
          privacy-neutral just because no money changes hands.
        </p>
      </Section>

      <Section title="Administrator access">
        <p>
          The administration area is not linked from anywhere in this public site. It requires authenticated,
          server-verified access, uses hashed passwords (Argon2id), and every sensitive action is checked on the
          server regardless of what the browser believes the user&apos;s session state to be.
        </p>
      </Section>

      <Section title="Questions">
        <p>
          This is an academic project. If you have a question about how a specific feature handles data, the
          relevant source code is in this project&apos;s repository, including the FastAPI backend and the
          Drizzle database schema.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 border-t border-border pt-8">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
