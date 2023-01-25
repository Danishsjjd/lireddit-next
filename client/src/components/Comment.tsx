import { FaHeart, FaReply, FaEdit, FaTrash } from "react-icons/fa"
import { Comment as CommentType, usePost } from "@/context/PostContext"
import { IconBtn } from "./IconBtn"
import { useEffect, useState } from "react"
import CommentList from "./CommentList"

type Props = {
  comment: CommentType[number]
}

const Comment = ({ comment }: Props) => {
  const { createdAt, id, message, user } = comment
  const { commentsByParentId } = usePost()
  const [ariaHidden, setAriaHidden] = useState(false)

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

  return (
    <>
      <div className="rounded-lg border p-2">
        <header className="mb-2 flex justify-between text-purple-500">
          <span className=" font-bold">{user.username}</span>
          <span className="date">{clientCreatedAt}</span>
        </header>
        <div className="mx-2 whitespace-pre-wrap">{message}</div>
        <footer className="mt-2 flex gap-1">
          <IconBtn isActive={false} Icon={FaHeart} aria-label="Like">
            2
          </IconBtn>
          <IconBtn isActive={false} Icon={FaReply} aria-label="Reply" />
          <IconBtn isActive={false} Icon={FaEdit} aria-label="Edit" />
          <IconBtn
            isActive={false}
            Icon={FaTrash}
            aria-label="Trash"
            color="danger"
          />
        </footer>
      </div>
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
