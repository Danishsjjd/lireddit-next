import { PrismaClient } from ".prisma/client"
import RedisStoreFunc from "connect-redis"
import cors from "cors"
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

export default async function middleware(app: Express, prisma: PrismaClient) {
  const redis = createClient({
    legacyMode: true,
    password: process.env.REDIS_PASSWORD!,
    url: process.env.REDIS_URL!,
  })
  redis.connect().catch(console.error)

  const RedisStore = RedisStoreFunc(session)

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  )

  // TODO: it can lead to an issue
  let request: null | Request = null
  let response: null | Response = null

  app.set("trust proxy", 1) // server behind the proxy (Heroku,nginx...)
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true, // if true, cookie cannot be manipulated from client-side javascript
        sameSite: "lax",
        // Use "strict" if you want the cookie to be sent only with requests originating from the same site.
        // Use "lax" if you want a balance between security and functionality for cross-site requests initiated by third-party websites.
        // Use "none" with Secure: true if you need the cookie to be sent with all requests, including cross-origin requests.

        secure: false, // cookie only works in https to debug you can set it to false
        // I'm setting it as false because I don't know how I will set nginx proxy: https://www.digitalocean.com/community/questions/secure-cookies-not-working-despite-successful-https-connection
        domain: process.env.COOKIE_DOMAIN, // allowed domain
      },
      saveUninitialized: false,
      secret: process.env.SECRET_KEY || "secret",
      resave: false,
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
