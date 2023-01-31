import { Field, ObjectType, ID } from "type-graphql"
import { Comment } from "./Comment"
import { User } from "./User"

@ObjectType()
export class Post {
  @Field((_type) => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field((_type) => [Comment], { nullable: true })
  comments: Comment[]

  @Field((_type) => User, { nullable: true })
  User: User

  @Field({ nullable: true })
  userId: string

  // skip overwrite 👇
}
