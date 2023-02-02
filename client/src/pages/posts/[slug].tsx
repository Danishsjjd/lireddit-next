import CommentForm from "@/components/CommentForm"
import CommentList from "@/components/CommentList"
import Header from "@/components/Header"
import PostBox from "@/components/PostBox"
import { PostProvider, usePost } from "@/context/PostContext"
import {
  PostDocument,
  PostQuery,
  useCreateCommentMutation,
} from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import { Dispatch, SetStateAction } from "react"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.query
  const queryClient = new QueryClient()

  const queryKey = ["post", { id: slug }]

  try {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn: () => graphqlRequest.request(PostDocument, { id: slug }),
    })
    const data = queryClient.getQueryData<PostQuery>(queryKey)
    if (!data)
      return {
        notFound: true,
      }
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
      <Header />
      <div className="mx-auto max-w-7xl space-y-5 p-5">
        <PostBox
          post={post?.post as PostQuery["post"]}
          userId={user?.user?.id}
        />
        <CommentForm loading={false} onSubmit={onSubmit} />
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
