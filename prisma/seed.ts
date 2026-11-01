import { PrismaClient, InstitutionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Home Loan", slug: "home-loan", description: "Loans for buying, building or improving a home." },
    { name: "Personal Loan", slug: "personal-loan", description: "Unsecured loans for eligible personal expenses." },
    { name: "Loan Against Property", slug: "loan-against-property", description: "Loans secured against eligible property." },
    { name: "Business Loan", slug: "business-loan", description: "Funding options for businesses and MSMEs." },
    { name: "Car Loan", slug: "car-loan", description: "Financing for new and used cars." },
    { name: "Education Loan", slug: "education-loan", description: "Funding for eligible education expenses." }
  ];

  for (const category of categories) {
    await prisma.loanCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category
    });
  }

  // Intentionally no lender rates or promotional offers are seeded.
  // Public financial data must be sourced and verified before publication.
  console.log(`Seeded ${categories.length} loan categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
