import { FaHeart, FaReply, FaEdit, FaTrash } from "react-icons/fa"
import { Comment as CommentType, usePost } from "@/context/PostContext"
import { IconBtn } from "./IconBtn"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import CommentList from "./CommentList"
import CommentForm from "./CommentForm"
import { useCreateCommentMutation } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"

type Props = {
  comment: CommentType[number]
}

const Comment = ({ comment }: Props) => {
  const { createdAt, id, message, user } = comment
  const { commentsByParentId, post, onPostCommentUpdates } = usePost()
  const [ariaHidden, setAriaHidden] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const { mutate, isLoading } = useCreateCommentMutation(graphqlRequest)

  const childComments = commentsByParentId?.[id]

  const dateFormatter = Intl.DateTimeFormat("eng", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  const [clientCreatedAt, setClientCreatedAt] = useState(
    dateFormatter.format(Date.parse(createdAt)).slice(0, -3)
  )

  // ? node.js provide different character in space while browser
  // ? provide different so first browser paint not match that's
  // ? why I'm removing space in server and adding back in client browser
  useEffect(() => {
    setClientCreatedAt(dateFormatter.format(Date.parse(createdAt)))
  }, [])

  function onNestedCommentCreation(
    msg: string,
    setMsg: Dispatch<SetStateAction<string>>
  ) {
    mutate(
      {
        options: {
          message: msg,
          postId: post?.post.id as string,
          parentId: id,
        },
      },
      {
        onSuccess({ createComment }) {
          onPostCommentUpdates?.(createComment)
          setMsg("")
          setIsReplying(false)
        },
      }
    )
  }

  return (
    <>
      <div className="rounded-lg border p-2">
        <header className="mb-2 flex justify-between text-purple-500">
          <span className=" font-bold">{user.username}</span>
          <span className="date">{clientCreatedAt}</span>
        </header>
        <div className="mx-2 whitespace-pre-wrap">{message}</div>
        <footer className="mt-2 flex gap-1">
          <IconBtn isActive={false} Icon={FaHeart}>
            2
          </IconBtn>
          <IconBtn
            onClick={() => setIsReplying((pre) => !pre)}
            isActive={isReplying}
            Icon={FaReply}
          />
          <IconBtn isActive={false} Icon={FaEdit} />
          <IconBtn isActive={false} Icon={FaTrash} color="danger" />
        </footer>
      </div>
      {isReplying && (
        <CommentForm
          error=""
          loading={isLoading}
          onSubmit={onNestedCommentCreation}
          autoFocus
          initialValue=""
        />
      )}
      {childComments && childComments?.length > 0 && (
        <>
          <div className={`${ariaHidden ? "hidden" : "flex"}`}>
            <button
              className="relative mt-2 w-4 -translate-x-1/2 cursor-pointer border-none bg-none p-0 outline-none before:absolute before:top-0 before:bottom-0 before:w-px before:bg-indigo-300 hover:before:bg-indigo-800"
              aria-label="Hide Replies"
              onClick={() => setAriaHidden(true)}
            />
            <div className="flex-grow pl-2">
              <CommentList comments={childComments} />
            </div>
          </div>
          <button
            className={`${
              !ariaHidden ? "hidden" : "block"
            } btn-primary btn mt-1`}
            onClick={() => setAriaHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  )
}

export default Comment
