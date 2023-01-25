import CommentList from "@/components/CommentList"
import { PostProvider } from "@/context/PostContext"
import { usePostQuery, PostDocument, PostQuery } from "@/generated/graphql"
import usePost from "@/hooks/usePost"
import graphqlRequest from "@/libs/graphqlRequest"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

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
  const { query } = useRouter()
  const { slug } = query
  const { data: post } = usePostQuery(graphqlRequest, {
    id: slug as string,
  })

  const { rootComments } = usePost(post as PostQuery)
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

export default Post
