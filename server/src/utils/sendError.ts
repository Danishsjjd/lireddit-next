import { FieldErrors } from "../types/errors"

export function sendError(
  field: string,
  message: string
): { errors: FieldErrors[] } {
  return { errors: [{ field, message }] }
}
