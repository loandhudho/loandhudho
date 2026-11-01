"use client";

import { useMemo, useState } from "react";

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export function EmiCalculator({ locale }: { locale: "en" | "hi" }) {
  const hi = locale === "hi";
  const [amount, setAmount] = useState("2500000");
  const [annualRate, setAnnualRate] = useState("9");
  const [years, setYears] = useState("20");
  const result = useMemo(() => {
    const principal = Number(amount);
    const rate = Number(annualRate);
    const months = Number(years) * 12;
    if (!Number.isFinite(principal) || !Number.isFinite(rate) || !Number.isFinite(months) || principal <= 0 || rate < 0 || months <= 0 || principal > 1_000_000_000 || rate > 100 || months > 600) return null;
    const monthlyRate = rate / 12 / 100;
    const emi = monthlyRate === 0 ? principal / months : principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const total = emi * months;
    return { emi, total, interest: total - principal };
  }, [amount, annualRate, years]);

  const labels = hi
    ? { title: "EMI कैलकुलेटर", desc: "अपनी लोन राशि, ब्याज दर और अवधि डालकर अनुमानित मासिक किस्त जानें।", amount: "लोन राशि (₹)", rate: "वार्षिक ब्याज दर (%)", tenure: "अवधि (वर्ष)", monthly: "अनुमानित मासिक EMI", principal: "लोन राशि", interest: "कुल ब्याज", total: "कुल भुगतान", invalid: "कृपया सही राशि, 0 से 100% तक ब्याज दर और 1 से 50 वर्ष की अवधि दर्ज करें।", note: "यह केवल अनुमान है। वास्तविक EMI, दर और शुल्क lender की शर्तों पर निर्भर करेंगे।" }
    : { title: "EMI calculator", desc: "Enter a loan amount, annual interest rate and tenure to estimate your monthly instalment.", amount: "Loan amount (₹)", rate: "Annual interest rate (%)", tenure: "Tenure (years)", monthly: "Estimated monthly EMI", principal: "Loan amount", interest: "Total interest", total: "Total payment", invalid: "Enter a valid amount, an interest rate from 0% to 100%, and a tenure from 1 to 50 years.", note: "This is an illustration, not a lender quote. Actual EMI, rates and charges depend on lender terms." };

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <label className="block text-sm font-semibold" htmlFor="loan-amount">{labels.amount}</label>
        <input id="loan-amount" type="number" min="1" max="1000000000" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]" />
        <label className="mt-6 block text-sm font-semibold" htmlFor="loan-rate">{labels.rate}</label>
        <input id="loan-rate" type="number" min="0" max="100" step="0.05" value={annualRate} onChange={(event) => setAnnualRate(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]" />
        <label className="mt-6 block text-sm font-semibold" htmlFor="loan-tenure">{labels.tenure}</label>
        <input id="loan-tenure" type="number" min="1" max="50" value={years} onChange={(event) => setYears(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--accent)] p-6">
        <p className="text-sm font-semibold text-[var(--muted)]">{labels.monthly}</p>
        {result ? <p className="mt-2 text-4xl font-bold tracking-tight text-[var(--primary)]">{formatINR(result.emi)}</p> : <p className="mt-2 text-sm font-semibold text-red-600">{labels.invalid}</p>}
        {result && <div className="mt-8 space-y-4">
          {[ [labels.principal, Number(amount)], [labels.interest, result.interest], [labels.total, result.total] ].map(([label, value]) => <div key={String(label)} className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3 text-sm"><span className="text-[var(--muted)]">{label}</span><strong>{formatINR(Number(value))}</strong></div>)}
        </div>}
        <p className="mt-6 text-xs leading-6 text-[var(--muted)]">{labels.note}</p>
      </div>
    </section>
  );
}
