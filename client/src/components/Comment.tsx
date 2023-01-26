import { Comment as CommentType, usePost } from "@/context/PostContext"
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useToggleLikeOnCommentMutation,
  useUpdateCommentMutation,
} from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import showError from "@/utils/showError"
import { ClientError } from "graphql-request"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa"
import { FiHeart } from "react-icons/fi"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"
import { IconBtn } from "./IconBtn"

type Props = {
  comment: CommentType[number]
}

const dateFormatter = Intl.DateTimeFormat("eng", {
  dateStyle: "medium",
  timeStyle: "short",
})

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
  const [clientCreatedAt, setClientCreatedAt] = useState(
    dateFormatter.format(Date.parse(createdAt)).slice(0, -3)
  )

  const { mutate: CreateCommentFunc, isLoading } =
    useCreateCommentMutation(graphqlRequest)

  const { mutate: updateCommentFunc, isLoading: isUpdatingLoading } =
    useUpdateCommentMutation(graphqlRequest)

  const { mutate: deleteCurrentComment } =
    useDeleteCommentMutation(graphqlRequest)

  const { mutate: toggleLikeFunc } =
    useToggleLikeOnCommentMutation(graphqlRequest)

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
    CreateCommentFunc(
      {
        options: {
          message: msg,
          postId: post?.post.id as string,
          parentId: id,
          userId: currentUser?.id as string,
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
        onSuccess() {
          onPostCommentDelete?.(id)
        },
        onError(error) {
          setError(showError(error as ClientError))
        },
      }
    )
  }

  const updateComment = (msg: string) => {
    updateCommentFunc(
      { options: { commentId: id, msg: msg } },
      {
        onError: (err) => {
          setError(showError(err as ClientError))
        },
        onSuccess: () => {
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
        onSuccess({ likeComment }) {
          onToggleLike?.(currentUser?.id as string, likeComment, id)
        },
      }
    )
  }

  const isCurrentLikeIt =
    comment.likes.filter(({ userId }) => userId == (currentUser?.id as string))
      .length > 0

  return (
    <>
      <div className="rounded-lg border p-2">
        <header className="mb-2 flex justify-between text-purple-500">
          <span className=" font-bold">{user.username}</span>
          <span className="date">{clientCreatedAt}</span>
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
          <IconBtn
            isActive={false}
            Icon={isCurrentLikeIt ? FaHeart : FiHeart}
            onClick={toggleLike}
          >
            {comment.likes.length.toString()}
          </IconBtn>
          <IconBtn
            onClick={() => setIsReplying((pre) => !pre)}
            isActive={isReplying}
            Icon={FaReply}
          />
          {user.id === currentUser?.id && (
            <>
              <IconBtn
                isActive={false}
                Icon={FaEdit}
                onClick={() => setIsUpdating((pre) => !pre)}
              />
              <IconBtn
                isActive={false}
                Icon={FaTrash}
                color="danger"
                onClick={deleteComment}
              />
            </>
          )}
        </footer>
        {error && (
          <span className="text-lg font-medium text-red-600">{error}</span>
        )}
      </div>
      {isReplying && (
        <div className="mt-3">
          <CommentForm
            loading={isLoading}
            onSubmit={onNestedCommentCreation}
            autoFocus
            initialValue=""
          />
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
