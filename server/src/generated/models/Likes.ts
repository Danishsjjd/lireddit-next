import { Field, ObjectType, ID } from "type-graphql"
import { User } from "./User"
import { Comment } from "./Comment"

@ObjectType()
export class Likes {
  @Field((_type) => ID)
  id: string

  @Field((_type) => User, { nullable: true })
  user: User

  @Field({ nullable: true })
  userId: string

  @Field((_type) => Comment, { nullable: true })
  comment: Comment

  @Field({ nullable: true })
  commentId: string

  // skip overwrite 👇
}
