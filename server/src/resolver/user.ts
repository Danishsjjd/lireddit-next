import { hash, verify } from "argon2"
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql"
import { COOKIE_NAME } from "../constant"
import { isAuthenticated } from "../middleware/isAuthenticated"
import { MyContext } from "../type"
import { UserResponse } from "../types/gqResponse"
import { UserInput, UserLoginInput } from "../types/user"
import { sendError } from "../utils/sendError"

@Resolver()
class userResolver {
  @Query(() => UserResponse)
  @UseMiddleware(isAuthenticated)
  async me(@Ctx() { prisma, req }: MyContext): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId as string },
    })
    if (!user) return sendError("server", "server error")
    return { user: user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { prisma, req }: MyContext,
    @Arg("options") options: UserLoginInput
  ): Promise<UserResponse> {
    const { password, usernameOrEmail } = options

    let obj: { username?: string; email?: string } = {
      username: usernameOrEmail as string,
    }
    if (usernameOrEmail.includes("@"))
      obj = { email: usernameOrEmail as string }

    const user = await prisma.user.findUnique({
      where: obj,
    })
    if (!user) return sendError("usernameOrEmail", "user is not exists")

    const isPasswordMatch = await verify(user.password, password as string)
    if (!isPasswordMatch) return sendError("password", "password is incorrect")

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => UserResponse)
  async signup(
    @Ctx() { prisma, req }: MyContext,
    @Arg("options") options: UserInput
  ): Promise<UserResponse> {
    const { password, username, email } = options

    const hashedPassword = await hash(password as string)

    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        username: username as string,
        email: email as string,
      },
    })

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) => {
      res.clearCookie(COOKIE_NAME)
      req.session.destroy((err) => {
        if (err) return resolve(false)
        return resolve(true)
      })
    })
  }
}

export default userResolver
