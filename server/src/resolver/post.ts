import { Ctx, Query, Resolver, Arg, Info } from "type-graphql"
import { Post } from "../generated/models/Post"
import { MyContext } from "../type"
import { PrismaSelect } from "@paljs/plugins"
import { GraphQLResolveInfo } from "graphql"

function extractKey(info: GraphQLResolveInfo, nested?: string) {
  const postSelect = new PrismaSelect(info).value.select

  let nestedKey: any = null
  if (nested)
    if (postSelect[nested]) {
      nestedKey = postSelect[nested]
      delete postSelect[nested]
    }

  return [postSelect, nestedKey]
}

@Resolver()
class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { prisma }: MyContext, @Info() info: GraphQLResolveInfo) {
    const [postSelect, commentsSelect] = extractKey(info, "comments")

    if (commentsSelect) {
      const res = await prisma.post.findMany({
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
      return res
    } else return prisma.post.findMany()
  }

  @Query(() => Post)
  async post(
    @Arg("id") id: string,
    @Ctx() { prisma }: MyContext,
    @Info() info: any
  ) {
    const [postSelect, commentsSelect] = extractKey(info, "comments")

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
