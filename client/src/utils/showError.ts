import { ClientError } from "graphql-request"

export default function showError(err: ClientError): string {
  return err?.response?.errors?.[0]?.message as string
}
