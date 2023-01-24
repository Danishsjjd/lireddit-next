import { Field, ObjectType, ID } from "type-graphql"
import { Comment } from "./Comment"

@ObjectType()
export class Post {
  @Field((_type) => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  // skip overwrite 👇
}

@ObjectType()
export class PostWithComments extends Post {
  @Field((_type) => [Comment])
  comments: Comment[]
}
