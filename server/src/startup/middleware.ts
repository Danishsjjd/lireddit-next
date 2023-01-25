import { PrismaClient } from ".prisma/client"
import type { Express } from "express"
import { createYoga } from "graphql-yoga"
import { MyContext } from "../type"
import { buildSchema } from "type-graphql"
import PostResolver from "../resolver/post"
import { ErrorInterceptor } from "../middleware/error"
import CommentsResolver from "../resolver/comment"

export default async function middleware(app: Express, prisma: PrismaClient) {
  const currentUser = (
    await prisma.user.findFirst({ where: { username: "danish" } })
  )?.id
  const yoga = createYoga({
    schema: await buildSchema({
      resolvers: [PostResolver, CommentsResolver],
      validate: false,
      globalMiddlewares: [ErrorInterceptor],
    }),
    context: (): MyContext => ({ prisma, userId: currentUser as string }),
  })
  app.use("/graphql", yoga)
}
