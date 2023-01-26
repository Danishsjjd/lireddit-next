import { PrismaSelect } from "@paljs/plugins"
import { GraphQLResolveInfo } from "graphql"

export function extractKey(info: GraphQLResolveInfo, nested?: string) {
  const postSelect = new PrismaSelect(info).value.select

  let nestedKey: any = null
  if (nested)
    if (postSelect[nested]) {
      nestedKey = postSelect[nested]
      delete postSelect[nested]
    }

  return [postSelect, nestedKey]
}
