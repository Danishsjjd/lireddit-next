import "reflect-metadata"
import express from "express"
import { __prod__ } from "./constant"
import middleware from "./startup/middleware"
import prisma from "./startup/db"

async function main() {
  const app = express()
  const port = process.env.PORT || 4000

  middleware(app, prisma)

  app.get("/", (_, res) => {
    res.send("API's working")
  })

  app.listen(port, () => {
    if (!__prod__) console.log(`server is running at ${port}`)
  })
}

main().catch(console.error)
