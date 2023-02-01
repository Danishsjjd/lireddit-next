import { Comment as CommentType } from "@/context/PostContext"
import Comment from "./Comment"

const CommentList = ({ comments }: { comments: CommentType }) => {
  return (
    <>
      {comments?.map((comment) => (
        <div key={comment.id} className="my-4 last:mb-0">
          <Comment comment={comment} />
        </div>
      ))}
    </>
  )
}

export default CommentList
