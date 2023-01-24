import { PrismaClient } from ".prisma/client"
import type { Express } from "express"
import { createYoga } from "graphql-yoga"
import { MyContext } from "../type"
import { buildSchema } from "type-graphql"
import Post from "../resolver/post"
import { ErrorInterceptor } from "../middleware/error"

export default async function middleware(app: Express, prisma: PrismaClient) {
  const yoga = createYoga({
    schema: await buildSchema({
      resolvers: [Post],
      globalMiddlewares: [ErrorInterceptor],
    }),
    context: (): MyContext => ({ prisma }),
  })
  app.use("/graphql", yoga)
}
