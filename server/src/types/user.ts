import { Field, InputType } from "type-graphql"

@InputType()
export class UserInput {
  @Field(() => String, { nullable: true })
  username?: String

  @Field(() => String, { nullable: true })
  email?: String

  @Field()
  password: String
}
