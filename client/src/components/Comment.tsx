import { Comment as CommentType, usePost } from "@/context/PostContext"
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useToggleLikeOnCommentMutation,
  useUpdateCommentMutation,
} from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import showError from "@/utils/showError"
import { Dispatch, SetStateAction, useState } from "react"
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa"
import { FiHeart } from "react-icons/fi"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"
import { IconBtn } from "./IconBtn"

type Props = {
  comment: Exclude<CommentType, null | undefined>[number]
}

const Comment = ({ comment }: Props) => {
  const { createdAt, id, message, user } = comment
  const {
    commentsByParentId,
    post,
    onPostCommentCreate,
    onPostCommentDelete,
    onPostCommentUpdate,
    onToggleLike,
    user: currentUser,
  } = usePost()

  const childComments = commentsByParentId?.[id]

  const [ariaHidden, setAriaHidden] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | false>(false)

  const { mutate: CreateCommentFunc, isLoading } = useCreateCommentMutation(graphqlRequest)

  const { mutate: updateCommentFunc, isLoading: isUpdatingLoading } = useUpdateCommentMutation(graphqlRequest)

  const { mutate: deleteCurrentComment } = useDeleteCommentMutation(graphqlRequest)

  const { mutate: toggleLikeFunc } = useToggleLikeOnCommentMutation(graphqlRequest)

  function onNestedCommentCreation(msg: string, setMsg: Dispatch<SetStateAction<string>>) {
    CreateCommentFunc(
      {
        options: {
          message: msg,
          postId: post?.post.id as string,
          parentId: id,
        },
      },
      {
        onSuccess({ createComment }) {
          onPostCommentCreate?.(createComment)
          setMsg("")
          setIsReplying(false)
        },
      }
    )
  }

  const deleteComment = () => {
    deleteCurrentComment(
      { commentId: id },
      {
        onSuccess(data) {
          if (data.deleteComment.errors) return showError(setError, data.deleteComment.errors)
          onPostCommentDelete?.(id)
        },
      }
    )
  }

  const updateComment = (msg: string) => {
    updateCommentFunc(
      { options: { commentId: id, msg: msg } },
      {
        onSuccess: (data) => {
          if (data.updateComment.errors) return showError(setError, data.updateComment.errors)

          onPostCommentUpdate?.(id, msg)
          setIsUpdating(false)
        },
      }
    )
  }

  const toggleLike = () => {
    toggleLikeFunc(
      { commentId: id },
      {
        onSuccess({ changeLikeOnComment }) {
          onToggleLike?.(currentUser?.user?.id as string, changeLikeOnComment.isHappen || false, id)
        },
      }
    )
  }

  let isCurrentLikeIt = null
  if (comment.likes) {
    isCurrentLikeIt = comment.likes.some(({ userId }) => userId == (currentUser?.user?.id as string))
  }

  return (
    <>
      <div className="rounded-lg border bg-zinc-900 p-2">
        <header className="mb-2 flex justify-between text-white">
          <span className=" font-bold">{user?.username}</span>
          <span className="date">{new Date(createdAt).toString()}</span>
        </header>
        <div className="mx-2 whitespace-pre-wrap">
          {isUpdating ? (
            <CommentForm
              loading={isUpdatingLoading}
              onSubmit={updateComment}
              autoFocus
              initialValue={comment.message}
            />
          ) : (
            message
          )}
        </div>
        <footer className="mt-2 flex gap-1">
          <IconBtn isActive={false} Icon={isCurrentLikeIt ? FaHeart : FiHeart} onClick={toggleLike}>
            {comment.likes && comment.likes.length.toString()}
          </IconBtn>
          <IconBtn onClick={() => setIsReplying((pre) => !pre)} isActive={isReplying} Icon={FaReply} />
          {user?.id === currentUser?.user?.id && (
            <>
              <IconBtn isActive={false} Icon={FaEdit} onClick={() => setIsUpdating((pre) => !pre)} />
              <IconBtn isActive={false} Icon={FaTrash} color="danger" onClick={deleteComment} />
            </>
          )}
        </footer>
        {error && <span className="text-lg font-medium text-red-600">{error}</span>}
      </div>
      {isReplying && (
        <div className="mt-3">
          <CommentForm loading={isLoading} onSubmit={onNestedCommentCreation} autoFocus initialValue="" />
        </div>
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
            className={`${!ariaHidden ? "hidden" : "block"} btn-primary btn mt-1`}
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
