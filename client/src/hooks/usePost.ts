import { PostQuery } from "@/generated/graphql"
import { useMemo } from "react"

export type Comment = PostQuery["post"]["comments"]

export default function usePost(post: PostQuery) {
  const { post: postData } = post

  const commentsByParentId = useMemo(() => {
    const group: Record<any, Comment> = {}
    postData.comments.forEach((comment) => {
      group[comment.parentId as string] ||= []
      group[comment.parentId as string].push(comment)
    })
    return group
  }, [postData.comments])

  const rootComments = commentsByParentId["null"]

  return {
    commentsByParentId,
    rootComments,
  }
}
