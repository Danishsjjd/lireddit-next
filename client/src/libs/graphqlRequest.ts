import { GraphQLClient } from "graphql-request"

const graphqlRequest = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string,
  {
    credentials: "include",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }
)

export default graphqlRequest
