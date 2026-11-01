"use client";

import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitch({ locale }: { locale: "en" | "hi" }) {
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(nextLocale: "en" | "hi") {
    const params = new URLSearchParams(window.location.search);\n    params.set("lang", nextLocale);\n    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 text-xs font-semibold" aria-label="Choose language">
      <button type="button" onClick={() => changeLanguage("en")} aria-pressed={locale === "en"} className={`rounded-lg px-3 py-2 ${locale === "en" ? "bg-[var(--accent)] text-[var(--primary)]" : "text-[var(--muted)]"}`}>EN</button>
      <button type="button" onClick={() => changeLanguage("hi")} aria-pressed={locale === "hi"} className={`rounded-lg px-3 py-2 ${locale === "hi" ? "bg-[var(--accent)] text-[var(--primary)]" : "text-[var(--muted)]"}`}>हिन्दी</button>
    </div>
  );
}
