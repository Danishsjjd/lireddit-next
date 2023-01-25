import { Comment as CommentType } from "@/hooks/usePost"
import Comment from "./Comment"

const CommentList = ({ comments }: { comments: CommentType }) => {
  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="my-4">
          <Comment comment={comment} />
        </div>
      ))}
    </>
  )
}

export default CommentList
