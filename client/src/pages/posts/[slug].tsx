import CommentList from "@/components/CommentList"
import { PostProvider } from "@/context/PostContext"
import { PostDocument } from "@/generated/graphql"
import { usePost } from "@/context/PostContext"
import graphqlRequest from "@/libs/graphqlRequest"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"

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
  const { post, rootComments } = usePost()

  return (
    <PostProvider>
      <div className="mx-auto max-w-7xl space-y-5 p-5">
        <h1 className="text-5xl font-medium">{post?.post.title}</h1>
        <article className="text-lg">{post?.post.body}</article>
        <h3 className="text-xl font-medium">Comments</h3>
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
