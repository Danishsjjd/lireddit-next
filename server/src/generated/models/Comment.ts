import { Field, ObjectType, ID } from "type-graphql"
import { Post } from "./Post"
import { User } from "./User"
import { Likes } from "./Likes"

@ObjectType()
export class Comment {
  @Field((_type) => ID)
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  message: string

  @Field((_type) => Post)
  post: Post

  @Field()
  postId: string

  @Field((_type) => User)
  user: User

  @Field()
  userId: string

  @Field((_type) => Comment, { nullable: true })
  parent?: Comment

  @Field((_type) => [Comment])
  children: Comment[]

  @Field({ nullable: true })
  parentId?: string

  @Field((_type) => [Likes])
  likes: Likes[]
}
// skip overwrite 👇
