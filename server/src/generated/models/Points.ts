import { Field, ObjectType } from "type-graphql"
import { User } from "./User"
import { Post } from "./Post"

@ObjectType()
export class Points {
  @Field((_type) => User, { nullable: true })
  user?: User

  @Field()
  userId: string

  @Field((_type) => Post, { nullable: true })
  post?: Post

  @Field()
  postId: string

  // skip overwrite 👇
}
