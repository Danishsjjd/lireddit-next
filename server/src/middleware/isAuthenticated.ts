import { MiddlewareFn } from "type-graphql"
import { MyContext } from "../type"
import { FieldErrors } from "../types/errors"

export const isAuthenticated: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next
): Promise<{ errors: FieldErrors[] }> => {
  if (!req.session.userId)
    return {
      errors: [{ field: "user", message: "must be authenticated" }],
    }

  return next()
}
