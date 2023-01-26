import { ClientError } from "graphql-request"

export default function showError(err: ClientError) {
  return err?.response?.errors?.[0]?.message as string
}
