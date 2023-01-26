import { Mutation, Resolver, Arg, InputType, Field, Ctx } from "type-graphql"
import { Comment } from "../generated/models/Comment"
import { MyContext } from "../type"

@InputType()
class CommentsInputs {
  @Field({ nullable: true })
  parentId: string

  @Field()
  message: string

  @Field()
  postId: string
}

@Resolver()
class CommentsResolver {
  @Mutation(() => Comment)
  async createComment(
    @Arg("options") options: CommentsInputs,
    @Ctx() { prisma, userId }: MyContext
  ) {
    const { message, parentId, postId } = options

    const results = await prisma.comment.create({
      data: { message, parentId, postId, userId },
      include: { user: true },
    })

    return results
  }

  @Mutation(() => Comment)
  async updateComment() {}

  @Mutation(() => Boolean)
  async deleteComment() {}

  @Mutation(() => Boolean)
  async LikePost() {}
}

export default CommentsResolver
