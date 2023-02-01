import { Field, ObjectType } from "type-graphql"
import { User } from "./User"
import { Comment } from "./Comment"

@ObjectType()
export class Likes {
  @Field((_type) => User, { nullable: true })
  user?: User

  @Field()
  userId: string

  @Field((_type) => Comment, { nullable: true })
  comment?: Comment

  @Field()
  commentId: string

  // skip overwrite 👇
}
