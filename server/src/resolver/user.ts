import { Ctx, ObjectType, Query } from "type-graphql"
import { User } from "../generated/models/User"
import { MyContext } from "../type"

@ObjectType()
class userResolver {
  @Query(() => User)
  async me(@Ctx() { prisma, req }: MyContext) {
    return prisma.user.findUnique({
      where: { id: req.session.userId as string },
    })
  }
}

export default userResolver
