import { ObjectType, Field } from "type-graphql"
// import Comments from "./comment"

@ObjectType()
class Post {
  @Field()
  title: string

  @Field()
  id: string

  @Field()
  body: string

  // @Field(() => [Comments])
  // comments: Comments[]
}

export default Post
