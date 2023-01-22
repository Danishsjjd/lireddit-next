import { usePostsQuery } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import Link from "next/link"

export default function Home() {
  const { data, isLoading } = usePostsQuery(graphqlRequest)

  if (isLoading) return <span>loading...</span>

  return (
    <section className="flex flex-col gap-3 m-8 font-medium text-xl underline text-blue-800">
      {data?.posts?.map((post) => {
        return (
          <Link href={`/${post.id}`} key={post.id} className="">
            {post.title}
          </Link>
        )
      })}
    </section>
  )
}
