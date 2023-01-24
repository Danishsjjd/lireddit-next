import { GraphQLClient } from "graphql-request"

// const headers = {
//   authorization: "token"
// }

const graphqlRequest = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string,
  {
    // headers,
    credentials: "include",
  }
)

export default graphqlRequest
