import Header from "@/components/Header"
import PostBox from "@/components/PostBox"
import { useMeQuery, usePostsQuery } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"

export default function Home() {
  const { data, isLoading } = usePostsQuery(graphqlRequest)
  const { data: user } = useMeQuery(graphqlRequest)

  if (isLoading) return <span>loading...</span>

  return (
    <>
      <Header />
      <section className="mx-auto mt-5 flex max-w-4xl flex-col gap-3">
        {data?.posts?.map((post) => (
          <PostBox post={post} key={post.id} userId={user?.me.user?.id} />
        ))}
      </section>
    </>
  )
}
