import { Field, ObjectType, ID } from 'type-graphql'
import { Comment } from './Comment'
import { Likes } from './Likes'

@ObjectType()
export class User {
  @Field((_type) => ID)
  id: string

  @Field()
  username: string

  @Field((_type) => [Comment])
  comments: Comment[]

  @Field((_type) => [Likes])
  likes: Likes[]

  // skip overwrite 👇
}