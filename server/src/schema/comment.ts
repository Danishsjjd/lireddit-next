import { ObjectType, Field } from "type-graphql"

@ObjectType()
class Comments {
  @Field()
  id: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  message: string
}

export default Comments
