import { Field, ObjectType, ID } from 'type-graphql'
import { User } from './User'
import { Comment } from './Comment'

@ObjectType()
export class Likes {
  @Field((_type) => ID)
  id: string

  @Field((_type) => User)
  user: User

  @Field()
  userId: string

  @Field((_type) => Comment)
  comment: Comment

  @Field()
  commentId: string

  // skip overwrite 👇
}