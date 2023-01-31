import { Field, ObjectType } from "type-graphql"
import { User } from "../generated/models/User"
import { FieldErrors } from "./errors"

@ObjectType()
export class UserResponse {
  @Field(() => [FieldErrors], { nullable: true })
  errors?: FieldErrors[]

  @Field(() => User, { nullable: true })
  user?: User
}
