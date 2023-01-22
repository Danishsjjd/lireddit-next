import { Ctx, Query, Resolver } from "type-graphql"
import Post from "../schema/Post"
import { MyContext } from "../type"

@Resolver()
class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { prisma }: MyContext) {
    return prisma.post.findMany()
  }
}
export default PostResolver
