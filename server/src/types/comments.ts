import { InputType, Field } from "type-graphql"

@InputType()
export class CommentsInputs {
  @Field({ nullable: true })
  parentId: string

  @Field()
  message: string

  @Field()
  postId: string
}

@InputType()
export class CommentModify {
  @Field()
  commentId: string

  @Field()
  msg: string
}
