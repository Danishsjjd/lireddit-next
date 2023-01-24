import { Ctx, Query, Resolver, Arg } from "type-graphql"
import Post from "../schema/Post"
import { MyContext } from "../type"

@Resolver()
class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { prisma }: MyContext) {
    return prisma.post.findMany()
  }

  @Query(() => Post)
  async post(@Arg("id") id: string, @Ctx() { prisma }: MyContext) {
    const res = await prisma.post.findFirst({
      where: {
        id,
      },
      select: {
        body: true,
        title: true,
        id: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            message: true,
            parentId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    })
    console.log(res)
    return res
  }
}
export default PostResolver
