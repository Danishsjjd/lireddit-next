import { useMeQuery } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import { NextRouter } from "next/router"
import { useEffect } from "react"

const usePublicRoute = (router: NextRouter) => {
  const { data, isLoading } = useMeQuery(graphqlRequest)

  useEffect(() => {
    if (!isLoading && data?.me.user) {
      router.replace((router.query.next as string) || "/")
    }
  }, [isLoading, data, router])

  return { isLoading }
}

export default usePublicRoute
