import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql"
import { Comment } from "../generated/models/Comment"
import { isAuthenticated } from "../middleware/isAuthenticated"
import { MyContext } from "../type"
import { CommentModify, CommentsInputs } from "../types/comments"

@Resolver()
class CommentsResolver {
  @Mutation(() => Comment)
  @UseMiddleware(isAuthenticated)
  async createComment(
    @Arg("options") options: CommentsInputs,
    @Ctx() { prisma, req }: MyContext
  ) {
    const { message, parentId, postId } = options

    if (message.length < 1) throw new Error("Message is required")

    const results = await prisma.comment.create({
      data: { message, parentId, postId, userId: req.session.userId as string },
      include: { user: true },
    })

    return { data: results }
  }

  @Mutation(() => Boolean)
  async updateComment(
    @Ctx() { prisma, req }: MyContext,
    @Arg("options") options: CommentModify
  ) {
    const { commentId, msg } = options
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, message: true, userId: true },
    })
    if (!comment) throw new Error("comment is not exists")
    if (comment.userId !== req.session.userId)
      throw new Error("you cannot edit others comments")
    comment.message = msg
    await prisma.comment.update({
      where: { id: comment.id },
      data: { message: msg },
      select: { id: true },
    })
    return true
  }

  @Mutation(() => Boolean)
  async deleteComment(
    @Arg("commentId") commentId: string,
    @Ctx() { prisma, req }: MyContext
  ) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    })
    if (comment?.userId != req.session.userId)
      throw new Error("you cannot delete others comments")
    await prisma.comment.delete({ where: { id: commentId } })
    return true
  }

  @Mutation(() => Boolean)
  async likeComment(
    @Arg("commentId") commentId: string,
    @Ctx() { prisma, req }: MyContext
  ) {
    const comment = await prisma.likes.findUnique({
      where: {
        userId_commentId: { userId: req.session.userId as string, commentId },
      },
    })
    if (!comment) {
      await prisma.likes.create({
        data: { userId: req.session.userId as string, commentId },
      })
      return true
    }
    await prisma.likes.delete({
      where: {
        userId_commentId: { userId: req.session.userId as string, commentId },
      },
    })
    return false
  }
}

export default CommentsResolver
