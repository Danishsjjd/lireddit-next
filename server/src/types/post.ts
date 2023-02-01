import { Field, InputType, Int } from "type-graphql"

@InputType()
export class PostInput {
  @Field()
  body: string

  @Field()
  title: string
}

@InputType()
export class UpdatePostInput {
  @Field()
  postId: string

  @Field()
  body: string

  @Field()
  title: string
}

@InputType()
export class PointInput {
  @Field()
  postId: string

  @Field()
  userId: string

  @Field(() => Int)
  updatePointToThis: number
}
