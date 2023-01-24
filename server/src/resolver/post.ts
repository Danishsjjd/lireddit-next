import { Ctx, Query, Resolver, Arg, Info } from "type-graphql"
import { Post, PostWithComments } from "../generated/models/Post"
import { MyContext } from "../type"
import { PrismaSelect } from "@paljs/plugins"
//

@Resolver()
class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { prisma }: MyContext) {
    return prisma.post.findMany()
  }

  @Query(() => PostWithComments)
  async post(
    @Arg("id") id: string,
    @Ctx() { prisma }: MyContext,
    @Info() info: any
  ) {
    const postSelect = new PrismaSelect(info).value.select

    let commentsSelect: any = null
    if (postSelect.comments) {
      commentsSelect = postSelect.comments
      delete postSelect.comments
    }

    const res = await prisma.post.findFirst({
      where: {
        id,
      },
      select: {
        ...postSelect,
        comments: !commentsSelect
          ? false
          : {
              orderBy: {
                createdAt: "desc",
              },
              select: {
                ...commentsSelect.select,
              },
            },
      },
    })
    if (res === null) throw new Error("post id is not correct")
    return res
  }
}
export default PostResolver
