import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    const count = await prisma.myQuote.count()
    console.log("✅ Connection works! Total rows in Post table:", count)
  } catch (err) {
    console.error("❌ Connection failed:", err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
