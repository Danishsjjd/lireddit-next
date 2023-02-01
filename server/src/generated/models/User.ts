import { Field, ObjectType, ID } from "type-graphql"
import { Comment } from "./Comment"
import { Likes } from "./Likes"
import { Post } from "./Post"
import { Points } from "./Points"

@ObjectType()
export class User {
  @Field((_type) => ID)
  id: string

  @Field()
  username: string

  @Field()
  email: string

  @Field((_type) => [Comment], { nullable: true })
  comments?: Comment[]

  @Field((_type) => [Likes], { nullable: true })
  likes?: Likes[]

  @Field((_type) => [Post], { nullable: true })
  post?: Post[]

  @Field((_type) => [Points], { nullable: true })
  points?: Points[]

  // skip overwrite 👇
}
