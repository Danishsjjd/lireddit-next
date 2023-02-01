import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { GraphQLError } from "graphql"
import { MiddlewareFn } from "type-graphql"
import { SERVER_ERROR } from "../constant"

export const ErrorInterceptor: MiddlewareFn = async ({}, next) => {
  try {
    return await next()
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        //"Unique constraint failed on the {constraint}"
        const uniqueKey = (e?.meta?.target as string).match(/_(.*)_/)?.[1]
        return {
          errors: [
            { field: uniqueKey, message: `${uniqueKey} is already taken` },
          ],
        }
      }

      if (e.code === "P2003")
        // "Foreign key constraint failed on the field: {field_name}"
        return {
          errors: [
            {
              field: e.meta!.field_name,
              message: `${e.meta!.field_name} is not exists`,
            },
          ],
        }
    }
    console.log("error is", e)
    // e is not from prisma
    if (e instanceof Error) return new GraphQLError(e.message)
    // TODO: log error to file
    // e is not typeof ERROR
    return SERVER_ERROR
  }
}
