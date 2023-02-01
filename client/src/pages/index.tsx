import Header from "@/components/Header"
import { usePostsQuery } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import Link from "next/link"

export default function Home() {
  const { data, isLoading } = usePostsQuery(graphqlRequest)

  if (isLoading) return <span>loading...</span>

  return (
    <>
      <Header />
      <section className="flex flex-col gap-3 text-xl font-medium text-blue-800 underline">
        {data?.posts?.map((post) => {
          return (
            <Link href={`/posts/${post.id}`} key={post.id} className="">
              {post.title}
            </Link>
          )
        })}
      </section>
    </>
  )
}
