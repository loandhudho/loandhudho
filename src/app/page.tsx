import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitch } from "@/components/language-switch";
import { loanCategories } from "@/lib/loan-intents";

type SearchParams = Promise<{ lang?: string }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const locale = params.lang === "hi" ? "hi" : "en";
  const hi = locale === "hi";
  const copy = hi
    ? { navLoans: "लोन देखें", navHow: "यह कैसे काम करता है", navAbout: "हमारे बारे में", eyebrow: "आपका लोन खोजने का साथी", titleA: "अपनी योजनाओं के लिए", titleB: "सही लोन खोजें।", desc: "अपनी ज़रूरत बताएं। लोन विकल्प देखें, ज़रूरी जानकारी की तुलना करें और सोच-समझकर निर्णय लें।", placeholder: "जैसे: मुझे घर खरीदने के लिए लोन चाहिए...", search: "लोन खोजें", note: "बैंकों और NBFC के विकल्प देखें। अंतिम दरें और मंज़ूरी lender तय करता है।", explore: "अपनी ज़रूरत के अनुसार लोन देखें", what: "आपकी योजना क्या है?", howTitle: "लोन खोजने का आसान तरीका", steps: ["अपनी ज़रूरत बताएं", "ज़रूरी शर्तों की तुलना करें", "Lender की वेबसाइट पर आगे बढ़ें"], calc: "EMI कैलकुलेटर", calcDesc: "लोन राशि, ब्याज दर और अवधि के आधार पर अनुमानित EMI जानें।", about: "LoanDhudho पर दी गई जानकारी सामान्य मार्गदर्शन के लिए है। ब्याज दर, शुल्क, पात्रता और मंज़ूरी lender की शर्तों और सत्यापन पर निर्भर करती है।" }
    : { navLoans: "Explore loans", navHow: "How it works", navAbout: "About", eyebrow: "YOUR LOAN DISCOVERY PARTNER", titleA: "Find a loan that fits", titleB: "your plans.", desc: "Tell us what you need. Explore loan options, compare important details and make a more informed decision.", placeholder: "e.g. I want to buy a house...", search: "Find loans", note: "Explore options from banks and NBFCs. Final rates and approval are determined by the lender.", explore: "Explore loans by purpose", what: "What are you planning?", howTitle: "A clearer way to explore loans", steps: ["Tell us your intent", "Compare key details", "Continue with the lender"], calc: "EMI calculator", calcDesc: "Estimate your monthly instalment using loan amount, interest rate and tenure.", about: "Information on LoanDhudho is for general guidance. Interest rates, fees, eligibility and approval are subject to the lender's terms and verification." };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Link href={`/?lang=${locale}`} className="text-2xl font-black tracking-tight text-[var(--primary)]">LoanDhudho<span className="text-[var(--foreground)]">.</span></Link>
        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          <Link href={`/loans?lang=${locale}`}>{copy.navLoans}</Link>
          <a href="#how-it-works">{copy.navHow}</a>
          <a href="#about">{copy.navAbout}</a>
        </nav>
        <div className="flex items-center gap-2"><LanguageSwitch locale={locale} /><ThemeToggle /></div>
      </header>

      <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold tracking-wide text-[var(--primary)]">{copy.eyebrow}</p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{copy.titleA} <span className="text-[var(--primary)]">{copy.titleB}</span></h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">{copy.desc}</p>
          <form action="/loans" className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm sm:flex-row">
            <input type="hidden" name="lang" value={locale} />
            <input name="q" aria-label={copy.placeholder} placeholder={copy.placeholder} className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 outline-none placeholder:text-[var(--muted)]" />
            <button className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-foreground)]">{copy.search}</button>
          </form>
          <p className="mt-3 text-xs text-[var(--muted)]">{copy.note}</p>
          <Link href={`/calculators/emi?lang=${locale}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">{copy.calc} →</Link>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div><p className="text-sm font-semibold">{copy.explore}</p><p className="mt-1 text-xs text-[var(--muted)]">{copy.what}</p></div>
            <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--primary)]">{hi ? "लोकप्रिय" : "Popular"}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {loanCategories.slice(0, 6).map((category) => <Link key={category.slug} href={`/loans?category=${category.slug}&lang=${locale}`} className="rounded-2xl border border-[var(--border)] p-4 transition hover:border-[var(--primary)] hover:bg-[var(--accent)]">
              <p className="font-semibold">{category.name}</p><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{hi ? category.descriptionHi : category.description}</p>
            </Link>)}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-[var(--border)] py-10">
        <h2 className="text-xl font-bold">{copy.howTitle}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {copy.steps.map((item, index) => <div key={item} className="rounded-2xl bg-[var(--surface)] p-5"><p className="text-sm font-bold text-[var(--primary)]">0{index + 1}</p><p className="mt-2 font-semibold">{item}</p></div>)}
        </div>
      </section>
      <section className="mb-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-xl font-bold">{copy.calc}</h2><p className="mt-2 text-sm text-[var(--muted)]">{copy.calcDesc}</p></div><Link href={`/calculators/emi?lang=${locale}`} className="rounded-xl bg-[var(--primary)] px-5 py-3 text-center text-sm font-semibold text-[var(--primary-foreground)]">{hi ? "EMI कैलकुलेट करें" : "Calculate EMI"} →</Link></div>
      </section>
      <footer id="about" className="border-t border-[var(--border)] py-6 text-sm leading-6 text-[var(--muted)]">© {new Date().getFullYear()} LoanDhudho. {copy.about}</footer>
    </main>
  );
}
