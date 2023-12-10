export const __prod__ = process.env.NODE_ENV === "production"
export const COOKIE_NAME = "sid"
export const SERVER_ERROR = {
  errors: [{ field: "server", message: "server error" }],
}
