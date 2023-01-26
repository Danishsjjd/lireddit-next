import {
  CreateCommentMutation,
  MeQuery,
  PostQuery,
  useMeQuery,
  usePostQuery,
} from "@/generated/graphql"
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
  onPostCommentCreate?: (
    comment: CreateCommentMutation["createComment"]
  ) => void
  onPostCommentUpdate?: (id: string, msg: string) => void
  onPostCommentDelete?: (id: string) => void
  user?: MeQuery["me"] | undefined
  onToggleLike?: (
    userId: string,
    likeOrDisLike: boolean,
    commentId: string
  ) => void
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
  const { data: user } = useMeQuery(graphqlRequest)

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

  const onPostCommentCreate = ({
    createdAt,
    id,
    message,
    user,
    parentId,
  }: CreateCommentMutation["createComment"]) => {
    queryClient.setQueryData<PostQuery>(
      ["post", { id: post?.post.id }],
      (data) => {
        if (data?.post.comments) {
          const newComments = [
            {
              createdAt,
              id,
              message,
              user,
              parentId: parentId || null,
              likes: [],
            },
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

  const onPostCommentUpdate = (id: string, msg: string) => {
    queryClient.setQueryData<PostQuery>(
      ["post", { id: post?.post.id }],
      (data) => {
        if (data) {
          const updatedComments = data.post.comments.map((comment) => {
            if (comment.id === id) return { ...comment, message: msg }
            return comment
          })
          return {
            ...data,
            post: {
              ...data.post,
              comments: updatedComments,
            },
          }
        } else return data
      }
    )
  }

  const onPostCommentDelete = (id: string) => {
    queryClient.setQueryData<PostQuery>(
      ["post", { id: post?.post.id as string }],
      (data) => {
        if (data) {
          const newData: PostQuery["post"]["comments"] =
            data?.post.comments.filter((comment) => comment.id !== id) || []
          return {
            ...data,
            post: {
              ...data.post,
              comments: newData,
            },
          }
        }
      }
    )
  }

  const onToggleLike = (
    userId: string,
    likeOrDisLike: boolean,
    commentId: string
  ) => {
    queryClient.setQueryData<PostQuery>(
      ["post", { id: post?.post.id as string }],
      (data) => {
        if (data) {
          const updatedComments = data.post.comments.map((comment) => {
            if (commentId === comment.id) {
              if (likeOrDisLike)
                return { ...comment, likes: [...comment.likes, { userId }] }
              else {
                const newLike = comment.likes.filter(
                  (user) => user.userId !== userId
                )
                return { ...comment, likes: newLike }
              }
            }
            return comment
          })
          return { ...data, post: { ...data.post, comments: updatedComments } }
        }
        return data
      }
    )
  }

  return (
    <Context.Provider
      value={{
        post,
        rootComments,
        commentsByParentId,
        onPostCommentCreate,
        onPostCommentDelete,
        onPostCommentUpdate,
        onToggleLike,
        user: user?.me,
      }}
    >
      {children}
    </Context.Provider>
  )
}
