import { PrismaClient } from ".prisma/client"
import type { Request, Response } from "express"

export type MyContext = {
  prisma: PrismaClient
  req: Request
  res: Response
}
