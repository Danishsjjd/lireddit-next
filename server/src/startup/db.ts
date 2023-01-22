import { PrismaClient } from "@prisma/client"
import { __prod__ } from "../constant"
const prisma = new PrismaClient({ log: ["query"] })

export default prisma
