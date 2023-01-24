import { GraphQLError } from "graphql"
import { MiddlewareFn } from "type-graphql"

export const ErrorInterceptor: MiddlewareFn = async ({}, next) => {
  try {
    return await next()
  } catch (err) {
    const e = err as Error

    return new GraphQLError(e.message)
  }
}
