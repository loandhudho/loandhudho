import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { matchLoanIntent } from "@/lib/loan-intents";

const querySchema = z.object({ q: z.string().trim().min(1).max(200) });

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({ q: request.nextUrl.searchParams.get("q") ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a search phrase between 1 and 200 characters." }, { status: 400 });
  }

  const match = matchLoanIntent(parsed.data.q);
  return NextResponse.json({
    query: parsed.data.q,
    match: match ? { name: match.name, slug: match.slug } : null,
    note: "A category suggestion is not an eligibility check or loan approval."
  });
}
