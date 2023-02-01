import { Field, InputType } from "type-graphql"

@InputType()
export class UserInput {
  @Field()
  username?: String

  @Field()
  email?: String

  @Field()
  password: String
}
