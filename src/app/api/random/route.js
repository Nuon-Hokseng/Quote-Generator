import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const randomQuote = await prisma.$queryRawUnsafe(
      'SELECT quote, author FROM "myQuote" ORDER BY RANDOM() LIMIT 1'
    );

    if (!randomQuote || randomQuote.length === 0) {
      return new Response("No quotes found", { status: 404 });
    }

    return Response.json(randomQuote[0]);
  } catch (err) {
    console.error("Failed to fetch quote:", err);
    return new Response("Failed to fetch quote", { status: 500 });
  }
}
