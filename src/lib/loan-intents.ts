export type Locale = "en" | "hi";

export const loanCategories = [
  { name: "Home Loan", slug: "home-loan", description: "Buy, build or renovate your home", descriptionHi: "घर खरीदने, बनाने या मरम्मत के लिए", keywords: ["home loan", "house", "buy a house", "flat", "property purchase", "ghar", "makaan", "घर", "मकान", "फ्लैट", "आवास"] },
  { name: "Personal Loan", slug: "personal-loan", description: "Flexible funds for planned expenses", descriptionHi: "व्यक्तिगत ज़रूरतों और खर्चों के लिए", keywords: ["personal loan", "medical", "wedding", "travel", "emergency", "पर्सनल लोन", "व्यक्तिगत लोन", "शादी", "इलाज"] },
  { name: "Loan Against Property", slug: "loan-against-property", description: "Explore loans secured by property", descriptionHi: "प्रॉपर्टी गिरवी रखकर लोन के विकल्प", keywords: ["loan against property", "mortgage", "property mortgage", "lap", "property ke against", "प्रॉपर्टी पर लोन", "संपत्ति पर ऋण"] },
  { name: "Business Loan", slug: "business-loan", description: "Funding for businesses and MSMEs", descriptionHi: "व्यापार और MSME के लिए फंडिंग", keywords: ["business loan", "msme", "working capital", "shop", "business", "व्यापार लोन", "बिजनेस लोन", "दुकान"] },
  { name: "Car Loan", slug: "car-loan", description: "Finance a new or used car", descriptionHi: "नई या पुरानी कार खरीदने के लिए", keywords: ["car loan", "vehicle", "car", "गाड़ी", "कार लोन"] },
  { name: "Education Loan", slug: "education-loan", description: "Plan education in India or abroad", descriptionHi: "भारत या विदेश में पढ़ाई के लिए", keywords: ["education loan", "student loan", "college", "study abroad", "शिक्षा ऋण", "एजुकेशन लोन", "पढ़ाई"] },
  { name: "Gold Loan", slug: "gold-loan", description: "Borrow against eligible gold assets", descriptionHi: "सोने के बदले लोन के विकल्प", keywords: ["gold loan", "gold", "सोना", "गोल्ड लोन"] },
  { name: "Loan for Plot or Land", slug: "plot-loan", description: "Explore financing for a plot or land", descriptionHi: "प्लॉट या जमीन खरीदने के लिए", keywords: ["plot loan", "land loan", "buy land", "जमीन", "प्लॉट", "भूमि"] }
] as const;

export function matchLoanIntent(input: string) {
  const query = input.toLocaleLowerCase().normalize("NFKC").replace(/[.,!?;:]/g, " ").replace(/\s+/g, " ").trim();
  if (!query) return null;

  const ranked = loanCategories.map((category) => ({
    category,
    score: category.keywords.reduce((score, keyword) => {
      const normalized = keyword.toLocaleLowerCase().normalize("NFKC");
      return score + (query === normalized ? 5 : query.includes(normalized) ? 3 : normalized.includes(query) ? 1 : 0);
    }, 0)
  })).sort((a, b) => b.score - a.score);

  return ranked[0]?.score ? ranked[0].category : null;
}
