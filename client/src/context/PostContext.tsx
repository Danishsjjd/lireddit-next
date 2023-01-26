import { PostQuery, usePostQuery } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import { useQueryClient } from "@tanstack/react-query"
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
  onPostCommentUpdates?: (comment: Comment[number]) => void
}

const Context = createContext<ContextType>({})

export function usePost() {
  return useContext(Context)
}

export function PostProvider({ children }: Props) {
  const queryClient = useQueryClient()
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

  const onPostCommentUpdates = ({
    createdAt,
    id,
    message,
    user,
    parentId,
  }: Comment[number]) => {
    queryClient.setQueryData<PostQuery>(
      ["post", { id: post?.post.id }],
      (data) => {
        if (data?.post.comments) {
          const newComments = [
            { createdAt, id, message, user, parentId: parentId || null },
            ...data?.post.comments,
          ]
          return {
            post: {
              ...data?.post,
              comments: newComments,
            },
          }
        }
        return data
      }
    )
  }

  return (
    <Context.Provider
      value={{ post, rootComments, commentsByParentId, onPostCommentUpdates }}
    >
      {children}
    </Context.Provider>
  )
}
