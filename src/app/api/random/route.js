import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.myQuote.count();
    if (count === 0) {
      return new Response("No quotes found", { status: 404 });
    }
    const skip = Math.floor(Math.random() * count);
    const randomQuoteArr = await prisma.myQuote.findMany({
      skip,
      take: 1,
      select: { quote: true, author: true },
    });
    return Response.json(randomQuoteArr[0]);
  } catch (err) {
    console.error("Failed to fetch quote:", err);
    return new Response("Failed to fetch quote", { status: 500 });
  }
}
