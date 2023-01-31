import { Field, ObjectType, ID } from 'type-graphql'
import { Post } from './Post'
import { User } from './User'

import { Likes } from './Likes'

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

  @Field((_type) => Post, { nullable: true })
  post: Post

  @Field()
  postId: string

  @Field((_type) => User, { nullable: true })
  user: User

  @Field()
  userId: string

  @Field((_type) => Comment, { nullable: true })
  parent?: Comment

  @Field((_type) => [Comment], { nullable: true })
  children: Comment[]

  @Field({ nullable: true })
  parentId?: string

  @Field((_type) => [Likes], { nullable: true })
  likes: Likes[]

  // skip overwrite 👇
}