import { Field, ObjectType, ID } from "type-graphql"
import { Comment } from "./Comment"
import { Likes } from "./Likes"
import { Post } from "./Post"

@ObjectType()
export class User {
  @Field((_type) => ID)
  id: string

  @Field()
  username: string

  @Field((_type) => [Comment], { nullable: true })
  comments: Comment[]

  @Field((_type) => [Likes], { nullable: true })
  likes: Likes[]

  @Field((_type) => [Post], { nullable: true })
  post: Post[]

  // skip overwrite 👇
}
