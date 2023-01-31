import { PrismaClient } from ".prisma/client"
import RedisStoreFunc from "connect-redis"
import type { Express, Request, Response } from "express"
import session from "express-session"
import { createYoga } from "graphql-yoga"
import { createClient } from "redis"
import { buildSchema } from "type-graphql"
import { COOKIE_NAME } from "../constant"
import { ErrorInterceptor } from "../middleware/error"
import CommentsResolver from "../resolver/comment"
import PostResolver from "../resolver/post"
import userResolver from "../resolver/user"
import { MyContext } from "../type"
import { prod } from "../utils/utils"

export default async function middleware(app: Express, prisma: PrismaClient) {
  const redis = createClient({ legacyMode: true })
  redis.connect().catch(console.error)

  const RedisStore = RedisStoreFunc(session)

  let request: null | Request = null
  let response: null | Response = null
  app.use(
    session({
      secret: process.env.SECRET_KEY || "secret",
      resave: false,
      saveUninitialized: false,
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: prod, //for local case
        sameSite: "lax",
      },
    })
  )

  const yoga = createYoga({
    schema: await buildSchema({
      resolvers: [PostResolver, CommentsResolver, userResolver],
      validate: false,
      globalMiddlewares: [ErrorInterceptor],
    }),
    context: (): MyContext => ({
      prisma,
      req: request as Request,
      res: response as Response,
    }),
  })

  app.use(
    "/graphql",
    (req, res, next) => {
      request = req
      response = res
      next()
    },
    yoga
  )
}
