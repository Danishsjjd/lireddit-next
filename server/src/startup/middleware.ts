import { PrismaClient } from ".prisma/client"
import type { Express } from "express"
import { createYoga } from "graphql-yoga"
import { MyContext } from "../type"
import { buildSchema } from "type-graphql"
import Post from "../resolver/post"

export default function middleware(app: Express, prisma: PrismaClient) {
  const yoga = createYoga({
    schema: buildSchema({
      resolvers: [Post],
    }),
    context: (): MyContext => ({ prisma }),
  })
  app.use("/graphql", yoga)
}
