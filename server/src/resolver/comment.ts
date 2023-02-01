import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql"
import { isAuthenticated } from "../middleware/isAuthenticated"
import { MyContext } from "../type"
import { CommentModify, CommentsInputs } from "../types/comments"
import { BooleanResponse, CommentResponse } from "../types/gqResponse"
import { sendError } from "../utils/sendError"

@Resolver()
class CommentsResolver {
  @Mutation(() => CommentResponse)
  @UseMiddleware(isAuthenticated)
  async createComment(
    @Arg("options") options: CommentsInputs,
    @Ctx() { prisma, req }: MyContext
  ): Promise<CommentResponse> {
    const { message, parentId, postId } = options

    const results = await prisma.comment.create({
      data: {
        message,
        parentId,
        postId,
        userId: req.session.userId as string,
      },
      include: { user: true },
    })

    return { comments: results }
  }

  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuthenticated)
  async updateComment(
    @Ctx() { prisma, req }: MyContext,
    @Arg("options") options: CommentModify
  ): Promise<BooleanResponse> {
    const { commentId, msg } = options

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true },
    })

    if (!comment) return sendError("comment", "comment is not exists")

    if (comment.userId !== req.session.userId)
      return sendError("user", "you cannot update others comment")

    await prisma.comment.update({
      where: { id: comment.id },
      data: { message: msg },
      select: { id: true },
    })

    return { isHappen: true }
  }

  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuthenticated)
  async deleteComment(
    @Arg("commentId") commentId: string,
    @Ctx() { prisma, req }: MyContext
  ): Promise<BooleanResponse> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    })

    if (comment?.userId != req.session.userId)
      return sendError("user", "you cannot delete others comments")

    await prisma.comment.delete({ where: { id: commentId } })

    return { isHappen: true }
  }

  @Mutation(() => BooleanResponse)
  @UseMiddleware(isAuthenticated)
  async changeLikeOnComment(
    @Arg("commentId") commentId: string,
    @Ctx() { prisma, req }: MyContext
  ): Promise<BooleanResponse> {
    const comment = await prisma.likes.findUnique({
      where: {
        userId_commentId: { userId: req.session.userId as string, commentId },
      },
    })

    if (!comment) {
      await prisma.likes.create({
        data: { userId: req.session.userId as string, commentId },
      })

      return { isHappen: true }
    }

    await prisma.likes.delete({
      where: {
        userId_commentId: { userId: req.session.userId as string, commentId },
      },
    })

    return { isHappen: false }
  }
}

export default CommentsResolver
