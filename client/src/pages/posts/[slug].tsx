import CommentList from "@/components/CommentList"
import { PostProvider } from "@/context/PostContext"
import {
  PostDocument,
  PostQuery,
  useCreateCommentMutation,
} from "@/generated/graphql"
import { usePost } from "@/context/PostContext"
import graphqlRequest from "@/libs/graphqlRequest"
import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import CommentForm from "@/components/CommentForm"
import { Dispatch, SetStateAction } from "react"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.query
  const queryClient = new QueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: ["post", { id: slug }],
      queryFn: () => graphqlRequest.request(PostDocument, { id: slug }),
    })
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    }
  } catch (e) {
    return { notFound: true }
  }
}

const Post = () => {
  const { post, rootComments, onPostCommentUpdates } = usePost()
  const { mutate } = useCreateCommentMutation(graphqlRequest)

  const onSubmit = (
    message: string,
    setMessage: Dispatch<SetStateAction<string>>
  ) => {
    mutate(
      {
        options: {
          message: message,
          postId: post?.post.id as string,
          parentId: null,
        },
      },
      {
        onSuccess: ({ createComment }) => {
          onPostCommentUpdates?.(createComment)
          setMessage("")
        },
        onError(error, variables, context) {
          console.log("error is", error)
        },
      }
    )
  }

  return (
    <PostProvider>
      <div className="mx-auto max-w-7xl space-y-5 p-5">
        <h1 className="text-5xl font-medium">{post?.post.title}</h1>
        <article className="text-lg">{post?.post.body}</article>
        <h3 className="text-xl font-medium">Comments</h3>
        <CommentForm error="" loading={false} onSubmit={onSubmit} />
        <section>
          {rootComments != null && rootComments.length > 0 && (
            <CommentList comments={rootComments} />
          )}
        </section>
      </div>
    </PostProvider>
  )
}

const Provider = () => {
  return (
    <PostProvider>
      <Post />
    </PostProvider>
  )
}

export default Provider
