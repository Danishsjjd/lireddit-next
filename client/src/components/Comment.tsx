import { FaHeart, FaReply, FaEdit, FaTrash } from "react-icons/fa"
import { Comment as CommentType } from "@/hooks/usePost"
import { IconBtn } from "./IconBtn"
import { useEffect, useState } from "react"

type Props = {
  comment: CommentType[number]
}

const Comment = ({ comment }: Props) => {
  const { createdAt, id, message, user, parentId } = comment

  const dateFormatter = Intl.DateTimeFormat("eng", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  const [clientCreatedAt, setClientCreatedAt] = useState(
    dateFormatter.format(Date.parse(createdAt)).slice(0, -3)
  )

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
    </>
  )
}

export default Comment
