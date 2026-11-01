import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitch } from "@/components/language-switch";
import { loanCategories, matchLoanIntent } from "@/lib/loan-intents";

type SearchParams = Promise<{ q?: string; category?: string; lang?: string }>;

export const metadata = {
  title: "Explore Loans | LoanDhudho",
  description: "Explore loan categories and find options that match your borrowing purpose."
};

export default async function LoansPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const locale = params.lang === "hi" ? "hi" : "en";
  const query = params.q?.trim() ?? "";
  const matched = query ? matchLoanIntent(query) : null;
  const selected = params.category ?? matched?.slug;
  const visible = selected ? loanCategories.filter((item) => item.slug === selected) : loanCategories;
  const copy = locale === "hi"
    ? { title: "अपनी ज़रूरत के अनुसार लोन खोजें", subtitle: "लोन का उद्देश्य चुनें या अपनी ज़रूरत लिखें।", search: "लोन खोजें", button: "खोजें", all: "सभी लोन", result: "आपकी खोज से मिलता-जुलता विकल्प", none: "इस खोज से कोई स्पष्ट लोन श्रेणी नहीं मिली। दूसरी तरह से लिखकर देखें।", caveat: "यह शुरुआती श्रेणी सुझाव है, पात्रता या लोन मंज़ूरी की पुष्टि नहीं।", back: "होम पेज" }
    : { title: "Explore loans by purpose", subtitle: "Choose a loan category or describe what you need.", search: "Describe your requirement", button: "Search", all: "All loan categories", result: "Closest matching category", none: "We couldn't confidently match that request to a loan category. Try another description.", caveat: "This is an initial category suggestion, not confirmation of eligibility or loan approval.", back: "Home" };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-black tracking-tight text-[var(--primary)]">LoanDhudho<span className="text-[var(--foreground)]">.</span></Link>
        <div className="flex items-center gap-2"><LanguageSwitch locale={locale} /><ThemeToggle /></div>
      </header>
      <section className="py-14">
        <Link href={`/?lang=${locale}`} className="text-sm font-medium text-[var(--primary)]">← {copy.back}</Link>
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 text-[var(--muted)]">{copy.subtitle}</p>
        <form action="/loans" className="mt-7 flex max-w-2xl flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm sm:flex-row">
          <input type="hidden" name="lang" value={locale} />
          <input name="q" defaultValue={query} aria-label={copy.search} placeholder={locale === "hi" ? "जैसे: मुझे घर खरीदने के लिए लोन चाहिए" : "e.g. I need a loan to buy a house"} className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 outline-none placeholder:text-[var(--muted)]" />
          <button className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-foreground)]">{copy.button}</button>
        </form>
        {query && <div className="mt-5 max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm font-semibold">{matched ? copy.result : copy.none}</p>
          {matched && <Link href={`/loans?category=${matched.slug}&lang=${locale}`} className="mt-2 inline-flex rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--primary)]">{locale === "hi" ? matched.name : matched.name} →</Link>}
          <p className="mt-2 text-xs text-[var(--muted)]">{copy.caveat}</p>
        </div>}
        <div className="mt-12 flex items-center justify-between gap-4"><h2 className="text-xl font-bold">{copy.all}</h2>{selected && <Link href={`/loans?lang=${locale}`} className="text-sm text-[var(--primary)]">{locale === "hi" ? "फ़िल्टर हटाएँ" : "Clear filter"}</Link>}</div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((category) => <Link key={category.slug} href={`/loans?category=${category.slug}&lang=${locale}`} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--primary)] hover:bg-[var(--accent)]">
            <h3 className="font-semibold">{category.name}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{locale === "hi" ? category.descriptionHi : category.description}</p><span className="mt-4 inline-block text-sm font-semibold text-[var(--primary)]">{locale === "hi" ? "विकल्प देखें" : "Explore category"} →</span>
          </Link>)}
        </div>
        <p className="mt-10 max-w-3xl text-xs leading-6 text-[var(--muted)]">{locale === "hi" ? "LoanDhudho पर दिखाई गई जानकारी सामान्य जानकारी के लिए है। ब्याज दर, शुल्क, पात्रता और मंज़ूरी संबंधित lender की शर्तों पर निर्भर करती है।" : "Information on LoanDhudho is for general guidance. Interest rates, fees, eligibility and approval are subject to the lender's terms and verification."}</p>
      </section>
    </main>
  );
}
