import { PrismaClient } from ".prisma/client"
import RedisStoreFunc from "connect-redis"
import type { Express, Request } from "express"
import session from "express-session"
import { createYoga } from "graphql-yoga"
import { Redis } from "ioredis"
import { buildSchema } from "type-graphql"
import { ErrorInterceptor } from "../middleware/error"
import CommentsResolver from "../resolver/comment"
import PostResolver from "../resolver/post"
import userResolver from "../resolver/user"
import { MyContext } from "../type"

let RedisStore = RedisStoreFunc(session)
let redis = new Redis()

export default async function middleware(app: Express, prisma: PrismaClient) {
  const currentUser = (
    await prisma.user.findFirst({ where: { username: "muneeb" } })
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
