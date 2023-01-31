import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class FieldErrors {
  @Field()
  message: string

  @Field()
  field: string
}
