import { Field, Int, ObjectType } from "type-graphql"
import { Comment } from "../generated/models/Comment"
import { Post } from "../generated/models/Post"
import { User } from "../generated/models/User"
import { FieldErrors } from "./errors"

@ObjectType()
export class UserResponse {
  @Field(() => [FieldErrors], { nullable: true })
  errors?: FieldErrors[]

  @Field(() => User, { nullable: true })
  user?: User
}

@ObjectType()
export class CommentResponse {
  @Field(() => [FieldErrors], { nullable: true })
  errors?: FieldErrors[]

  @Field(() => Comment, { nullable: true })
  comments?: Comment
}

@ObjectType()
export class PostResponse {
  @Field(() => [FieldErrors], { nullable: true })
  errors?: FieldErrors[]

  @Field(() => Post, { nullable: true })
  post?: Post
}

@ObjectType()
export class BooleanResponse {
  @Field(() => [FieldErrors], { nullable: true })
  errors?: FieldErrors[]

  @Field(() => Boolean, { nullable: true })
  isHappen?: Boolean
}

@ObjectType()
export class PointResponse {
  @Field(() => [FieldErrors], { nullable: true })
  errors?: FieldErrors[]

  @Field(() => Int, { nullable: true })
  point?: number
}
