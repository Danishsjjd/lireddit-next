import { PostQuery, PostsQuery, useChangePointsMutation } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { BsHandThumbsDown, BsHandThumbsDownFill, BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs"

const PostBox = ({ post, userId }: { post: PostsQuery["posts"][number] | PostQuery["post"]; userId?: string }) => {
  const { mutate: changePointFunc } = useChangePointsMutation(graphqlRequest)
  const router = useRouter()
  const queryClient = useQueryClient()

  const point = post.points?.reduce((ac, cu) => {
    return (ac += cu.point)
  }, 0)

  const userPoint = post.points?.reduce((ac, cu) => {
    if (userId !== cu.userId) return ac

    if (cu.point === 0) return 2

    return cu.point
  }, 0)

  const btnClasses = "h-12 w-12 cursor-pointer rounded-full bg-zinc-600 p-3 hover:bg-zinc-500"

  const isOpen = router.pathname.includes("posts")

  const pointerChangeHandler = (point: number) => {
    if (!userId) return router.push(`/signup?next=${router.pathname}`)
    changePointFunc(
      {
        options: { postId: post.id, userId, updatePointToThis: point },
      },
      {
        onSuccess(data) {
          if (data.changePoints.errors) return null
          queryClient.invalidateQueries({
            queryKey: ["post", { id: post.id }],
            exact: true,
          })
          queryClient.setQueryData<PostsQuery>(["posts"], (data) => {
            if (data?.posts) {
              if (userPoint === 0)
                return {
                  ...data,
                  posts: data?.posts.map((singlePost) => {
                    if (singlePost.id === post.id)
                      return {
                        ...singlePost,
                        points: singlePost.points ? [...singlePost.points, { point, userId }] : [{ point, userId }],
                      }
                    return singlePost
                  }),
                }
              const newPost = data?.posts.map((singlePost) => {
                if (singlePost.id === post.id)
                  return {
                    ...singlePost,
                    points: singlePost.points?.map((singlePoint) => {
                      if (singlePoint.userId === userId) return { point, userId }
                      return singlePoint
                    }),
                  }
                return singlePost
              })
              return { ...data, posts: newPost }
            }
          })
        },
      }
    )
  }

  return (
    <div className="p-4">
      <div className="flex w-full gap-3 rounded bg-zinc-900 p-4 text-white">
        <div className={`flex w-20 flex-col items-center  px-4 py-2 ${!isOpen ? "justify-between" : "gap-3"}`}>
          {userPoint === 1 ? (
            <BsHandThumbsUpFill className={`${btnClasses}`} onClick={() => pointerChangeHandler(0)} />
          ) : (
            <BsHandThumbsUp className={`${btnClasses}`} onClick={() => pointerChangeHandler(1)} />
          )}
          <span className="text-2xl font-medium">{point}</span>
          {userPoint === -1 ? (
            <BsHandThumbsDownFill className={`${btnClasses}`} onClick={() => pointerChangeHandler(0)} />
          ) : (
            <BsHandThumbsDown className={`${btnClasses}`} onClick={() => pointerChangeHandler(-1)} />
          )}
        </div>
        <Link className="block space-y-4" href={`/posts/${post.id}`}>
          <div className="flex items-center justify-start gap-1 text-lg">
            <Image src="/logo.svg" alt="logo" className="w-8" width={32} height={32} />
            <span>r/{post.user?.username}</span>
            <span className="pl-2 text-zinc-400">.</span>
            <span className="text-zinc-400">{new Date(post.createdAt).toString()}</span>
          </div>
          <h3 className={`text-5xl font-bold ${isOpen ? "" : "line-clamp-1"}`}>{post.title}</h3>
          <p className={`text-xl font-medium ${isOpen ? "" : "line-clamp-2"}`}>{post.body}</p>
        </Link>
      </div>
    </div>
  )
}

export default PostBox
