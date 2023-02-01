import CommentForm from "@/components/CommentForm"
import CommentList from "@/components/CommentList"
import { PostProvider, usePost } from "@/context/PostContext"
import { PostDocument, useCreateCommentMutation } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import showError from "@/utils/showError"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { ClientError } from "graphql-request"
import { GetServerSideProps } from "next"
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
  const { post, rootComments, onPostCommentCreate, user } = usePost()
  const { mutate, error: createCommentError } =
    useCreateCommentMutation(graphqlRequest)

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
          onPostCommentCreate?.(createComment)
          setMessage("")
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
        <CommentForm
          error={
            ((createCommentError as ClientError) &&
              showError(createCommentError as ClientError)) ||
            ""
          }
          loading={false}
          onSubmit={onSubmit}
        />
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
