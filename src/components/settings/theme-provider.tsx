"use client";

import { createContext, useCallback, useContext, useState } from "react";

export type ThemeName = "midnight" | "sanctuary" | "warm";

const THEME_STORAGE_KEY = "dwh-theme";
const THEME_ATTR_VALUE: Record<ThemeName, string | null> = {
  midnight: null, // :root with no data-theme attribute is the default (Purple Midnight)
  sanctuary: "sanctuary",
  warm: "warm",
};

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * The inline script below runs in <head> via a <script> tag rendered from
 * the root layout (see app/layout.tsx), BEFORE React hydrates, so the
 * correct theme is painted on the very first frame. This is the standard
 * technique to avoid the "flash of wrong theme" that a React-only solution
 * cannot prevent, because React doesn't run until after first paint.
 */
export const THEME_NO_FLASH_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = stored;
    if (!theme) {
      var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      theme = prefersLight ? 'sanctuary' : 'midnight';
    }
    if (theme === 'sanctuary' || theme === 'warm') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {}
})();
`;

function readInitialTheme(): ThemeName {
  // Lazy useState initializer — runs synchronously during the component's
  // first render rather than in a post-render effect, so there is no extra
  // cascading render just to pick up a value the no-flash <script> (see
  // THEME_NO_FLASH_SCRIPT, run in <head> before hydration) already applied
  // to <html data-theme> before React ever ran. Safe during SSR because it
  // only runs client-side (`typeof document`), and safe during hydration
  // because nothing in this component's own JSX output depends on `theme`.
  if (typeof document === "undefined") return "midnight";
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    if (stored) return stored;
  } catch {
    // localStorage can throw in some locked-down browser contexts; fall
    // through to reading the attribute the no-flash script already set.
  }
  const current = document.documentElement.getAttribute("data-theme");
  return current === "sanctuary" || current === "warm" ? (current as ThemeName) : "midnight";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(readInitialTheme);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    const attrValue = THEME_ATTR_VALUE[next];
    if (attrValue) {
      document.documentElement.setAttribute("data-theme", attrValue);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
