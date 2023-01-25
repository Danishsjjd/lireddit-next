import { PostQuery, usePostQuery } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import { useRouter } from "next/router"
import { createContext, ReactNode, useContext, useMemo } from "react"

export type Comment = PostQuery["post"]["comments"]

type Props = {
  children: ReactNode
}

type ContextType = {
  post?: PostQuery
  rootComments?: Comment
  commentsByParentId?: Record<any, Comment>
}

const Context = createContext<ContextType>({})

export function usePost() {
  return useContext(Context)
}

export function PostProvider({ children }: Props) {
  const { query } = useRouter()
  const { slug } = query
  const { data: post } = usePostQuery(graphqlRequest, { id: slug as string })

  const { post: postData } = post as PostQuery

  const commentsByParentId = useMemo(() => {
    const group: Record<any, Comment> = {}
    postData.comments.forEach((comment) => {
      group[comment.parentId as string] ||= []
      group[comment.parentId as string].push(comment)
    })
    return group
  }, [postData.comments])

  const rootComments = commentsByParentId["null"]

  return (
    <Context.Provider value={{ post, rootComments, commentsByParentId }}>
      {children}
    </Context.Provider>
  )
}
