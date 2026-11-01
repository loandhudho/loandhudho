import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitch } from "@/components/language-switch";
import { EmiCalculator } from "@/components/emi-calculator";

type SearchParams = Promise<{ lang?: string }>;

export const metadata = {
  title: "EMI Calculator | LoanDhudho",
  description: "Estimate monthly loan instalments, total interest and total repayment."
};

export default async function EmiPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const locale = params.lang === "hi" ? "hi" : "en";
  const hi = locale === "hi";
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link href={`/?lang=${locale}`} className="text-2xl font-black tracking-tight text-[var(--primary)]">LoanDhudho<span className="text-[var(--foreground)]">.</span></Link>
        <div className="flex items-center gap-2"><LanguageSwitch locale={locale} /><ThemeToggle /></div>
      </header>
      <section className="py-12">
        <Link href={`/?lang=${locale}`} className="text-sm font-medium text-[var(--primary)]">← {hi ? "होम पेज" : "Home"}</Link>
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{hi ? "EMI कैलकुलेटर" : "EMI calculator"}</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{hi ? "मासिक किस्त, कुल ब्याज और कुल भुगतान का अनुमान लगाएं।" : "Estimate your monthly instalment, total interest and total repayment before comparing loan options."}</p>
        <EmiCalculator locale={locale} />
      </section>
    </main>
  );
}
