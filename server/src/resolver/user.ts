import { hash, verify } from "argon2"
import {
  Arg,
  Ctx,
  Mutation,
  ObjectType,
  Query,
  UseMiddleware,
} from "type-graphql"
import { COOKIE_NAME } from "../constant"
import { isAuthenticated } from "../middleware/isAuthenticated"
import { MyContext } from "../type"
import { UserResponse } from "../types/gqResponse"
import { UserInput } from "../types/user"

@ObjectType()
class userResolver {
  @Query(() => UserResponse)
  @UseMiddleware(isAuthenticated)
  async me(@Ctx() { prisma, req }: MyContext): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId as string },
    })
    if (!user) return { errors: [{ field: "server", message: "server error" }] }
    return { user: user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { prisma, req }: MyContext,
    @Arg("options") options: UserInput
  ): Promise<UserResponse> {
    const { password, username } = options

    const user = await prisma.user.findUnique({
      where: { username: username as string },
    })
    if (!user)
      return {
        errors: [{ field: "username", message: "username is incorrect" }],
      }

    const isPasswordMatch = await verify(user.password, password as string)
    if (!isPasswordMatch)
      return {
        errors: [{ field: "password", message: "password is incorrect" }],
      }

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => UserResponse)
  async signup(
    @Ctx() { prisma, req }: MyContext,
    @Arg("options") options: UserInput
  ): Promise<UserResponse> {
    const { password, username } = options

    const hashedPassword = await hash(password as string)

    try {
      const user = await prisma.user.create({
        data: {
          password: hashedPassword,
          username: username as string,
        },
      })
      req.session.userId = user.id
      return { user }
    } catch (err) {
      const e = err as any
      if (e.code === "P2002" && e.message.includes("Unique constraint failed"))
        return {
          errors: [{ field: "username", message: "username is already taken" }],
        }
      return {
        errors: [{ field: "server", message: "server error" }],
      }
    }
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
