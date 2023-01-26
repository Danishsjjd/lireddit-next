import { PrismaClient } from ".prisma/client"
import type { Express, Request } from "express"
import { createYoga } from "graphql-yoga"
import { MyContext } from "../type"
import { buildSchema } from "type-graphql"
import PostResolver from "../resolver/post"
import { ErrorInterceptor } from "../middleware/error"
import CommentsResolver from "../resolver/comment"
import session from "express-session"
import { Redis } from "ioredis"
import RedisStoreFunc from "connect-redis"
import userResolver from "../resolver/user"

let RedisStore = RedisStoreFunc(session)
let redis = new Redis()

export default async function middleware(app: Express, prisma: PrismaClient) {
  const currentUser = (
    await prisma.user.findFirst({ where: { username: "danish" } })
  )?.id
  let request: null | Request = null

  app.use(
    session({
      secret: "fjkldsfjs;lfjl",
      resave: false,
      saveUninitialized: true,
      name: "sessionId",
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: false, //for local case
        sameSite: "lax",
      },
    })
  )

  app.use("/", (req, _, next) => {
    req.session.userId = currentUser as string
    next()
  })

  const yoga = createYoga({
    schema: await buildSchema({
      resolvers: [PostResolver, CommentsResolver, userResolver],
      validate: false,
      globalMiddlewares: [ErrorInterceptor],
    }),
    context: (): MyContext => ({ prisma, req: request as Request }),
  })
  app.use(
    "/graphql",
    (req, _, next) => {
      request = req
      next()
    },
    yoga
  )
}
