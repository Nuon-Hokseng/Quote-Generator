import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Atomic random fetch
    const randomQuote = await prisma.$queryRaw`
      SELECT quote, author FROM "myQuote" ORDER BY RANDOM() LIMIT 1
    `

    if (!randomQuote || randomQuote.length === 0) {
      return new Response("No quotes found", { status: 404 })
    }

    return Response.json(randomQuote[0])
  } catch (err) {
    console.error("Failed to fetch quote:", err)
    return new Response("Failed to fetch quote", { status: 500 })
  }
}
