import { Field, Int, ObjectType } from "type-graphql"
import { Post } from "./Post"
import { User } from "./User"

@ObjectType()
export class Points {
  @Field((_type) => Int)
  point: number

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
