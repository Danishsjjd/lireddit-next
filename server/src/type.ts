import { PrismaClient } from ".prisma/client"
import { Request } from "express"

export type MyContext = {
  prisma: PrismaClient
  req: Request
}
