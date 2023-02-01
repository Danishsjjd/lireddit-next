import { Field, ObjectType, ID } from "type-graphql"
import { Comment } from "./Comment"
import { User } from "./User"
import { Points } from "./Points"

@ObjectType()
export class Post {
  @Field((_type) => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field((_type) => [Comment], { nullable: true })
  comments?: Comment[]

  @Field((_type) => User, { nullable: true })
  user?: User

  @Field()
  userId: string

  @Field((_type) => [Points], { nullable: true })
  points?: Points[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  // skip overwrite 👇
}
