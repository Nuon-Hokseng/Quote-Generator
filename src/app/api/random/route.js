import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const count = await prisma.myQuote.count();
  if (count === 0) return new Response("No quotes", { status: 404 });

  const skip = Math.floor(Math.random() * count);

  const randomQuote = await prisma.myQuote.findFirst({
    skip,
    select: { quote: true, author: true },
  });

  return Response.json(randomQuote);
}
