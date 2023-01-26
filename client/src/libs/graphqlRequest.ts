import { GraphQLClient } from "graphql-request"

const graphqlRequest = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string,
  {
    credentials: "include",
  }
)

export default graphqlRequest
