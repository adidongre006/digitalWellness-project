import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-base font-semibold">Digital Wellness Hub</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            A student project helping you build a healthier relationship with technology — honestly, with no
            hidden sponsorships.
          </p>
        </div>
        <FooterColumn
          title="Explore"
          links={[
            { href: "/assessment", label: "Wellness Assessment" },
            { href: "/resources", label: "All Resources" },
            { href: "/comparison", label: "Comparison Matrix" },
            { href: "/guides", label: "Setup Guides" },
          ]}
        />
        <FooterColumn
          title="Project"
          links={[
            { href: "/about", label: "About This Project" },
            { href: "/privacy", label: "Privacy" },
          ]}
        />
        <div>
          <p className="text-sm font-semibold text-foreground">Transparency</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Every resource listed here is independently verified against its official source, with the date it
            was last checked shown on its detail page and in the comparison table.
          </p>
        </div>
      </div>
     <div className="border-t border-border px-4 py-6 text-center text-[15px] FONT_MONO  bg-[#090814] gradient sm:px-6 lg:px-8">
  <div className="flex items-center justify-center gap-1">
    <span>
       <span className="text-[18px] ">©</span> {new Date().getFullYear()} Digital Wellness Resource Hub | Build with passion &
    </span>
    <Image
      alt="greenheart"
      src="/greenheart.svg"
      width={20}
      height={20}
      className="inline-block"
    />
  </div>
</div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <ul className="mt-2 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
