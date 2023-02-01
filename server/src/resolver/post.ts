import {
  Ctx,
  Query,
  Resolver,
  Arg,
  Info,
  Mutation,
  UseMiddleware,
  FieldResolver,
  Root,
} from "type-graphql"
import { Post } from "../generated/models/Post"
import { MyContext } from "../type"
import { GraphQLResolveInfo } from "graphql"
import { extractKey } from "../utils/extractKey"
import {
  BooleanResponse,
  PointResponse,
  PostResponse,
} from "../types/gqResponse"
import { PointInput, PostInput, UpdatePostInput } from "../types/post"
import { isAuthenticated } from "../middleware/isAuthenticated"
import { sendError } from "../utils/sendError"

@Resolver(Post)
class PostResolver {
  @FieldResolver(() => String)
  user(@Root() post: Post, @Ctx() { req }: MyContext) {
    if (req.session.userId === post.user?.id) {
      return post.user
    }
    // current user wants to see someone elses email
    return { ...post.user, email: "" }
  }

  @FieldResolver(() => String)
  comments(@Root() post: Post, @Ctx() { req }: MyContext) {
    return post.comments?.map((comment) =>
      (req.session.userId || "") === comment?.userId
        ? comment
        : { ...comment, user: { ...comment.user, email: "" } }
    )
  }

  @Query(() => [Post])
  async posts(@Ctx() { prisma }: MyContext, @Info() info: GraphQLResolveInfo) {
    const [postSelect, commentsSelect] = extractKey(info, "comments")

    if (commentsSelect) {
      const postWithComments = await prisma.post.findMany({
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
      return postWithComments
    }
    return prisma.post.findMany()
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

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuthenticated)
  async createPost(
    @Arg("options") options: PostInput,
    @Ctx() { prisma, req }: MyContext
  ): Promise<PostResponse> {
    const { body, title } = options

    const post = await prisma.post.create({
      data: { body, title, userId: req.session.userId as string },
    })

    return { post }
  }

  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuthenticated)
  async updatePost(
    @Arg("options") options: UpdatePostInput,
    @Ctx() { prisma, req }: MyContext
  ): Promise<BooleanResponse> {
    const { body, postId, title } = options

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: { id: true, userId: true },
    })

    if (!post) return sendError("post", "post is not exists")

    if (post.userId !== req.session.userId)
      return sendError("user", "cannot change others post")

    await prisma.post.update({ where: { id: post.id }, data: { body, title } })

    return { isHappen: true }
  }

  @Mutation(() => PointResponse)
  @UseMiddleware(isAuthenticated)
  async changePoints(
    @Ctx() { prisma, req }: MyContext,
    @Arg("options") options: PointInput
  ): Promise<PointResponse> {
    const { postId, updatePointToThis: currentPoint } = options

    const updatePointToThis =
      currentPoint >= 1 ? 1 : currentPoint <= -1 ? -1 : 0

    const point = await prisma.points.findUnique({
      where: {
        userId_postId: { userId: req.session.userId as string, postId },
      },
      select: { point: true, userId: true },
    })

    if (!point) {
      const newPoint = await prisma.points.create({
        data: {
          userId: req.session.userId as string,
          postId,
          point: updatePointToThis,
        },
      })

      return { point: newPoint.point }
    }

    const newPoint = await prisma.points.update({
      where: {
        userId_postId: {
          postId,
          userId: req.session.userId as string,
        },
      },
      data: {
        point: updatePointToThis,
      },
    })

    return { point: newPoint.point }
  }
}
export default PostResolver
