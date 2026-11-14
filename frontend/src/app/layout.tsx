import type { Metadata, Viewport } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import { ThemeProvider, THEME_NO_FLASH_SCRIPT } from "@/components/settings/theme-provider";
import { SiteNav } from "@/components/layout/site-nav";
import { ConditionalFooter } from "@/components/layout/conditional-footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Digital Wellness Resource Hub",
    template: "%s | Digital Wellness Resource Hub",
  },
  description:
    "Discover, compare, and configure trusted digital wellness tools for screen time, focus, sleep, and online privacy — built for students.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090814",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable}`} suppressHydrationWarning>
      <head>
        {/* Runs before hydration to set data-theme and avoid a flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_NO_FLASH_SCRIPT }} />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <SiteNav />
          <main id="main-content">{children}</main>
          <ConditionalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
