import { Dispatch, FormEventHandler, SetStateAction, useState } from "react"

type Props = {
  loading: boolean
  error?: string
  autoFocus?: boolean
  onSubmit: (
    message: string,
    setMessage: Dispatch<SetStateAction<string>>
  ) => void
  initialValue?: string
}
const CommentForm = ({
  error,
  loading,
  autoFocus = false,
  onSubmit,
  initialValue = "",
}: Props) => {
  const [message, setMessage] = useState(initialValue)
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    if (onSubmit) onSubmit(message, setMessage)
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <textarea
          autoFocus={autoFocus}
          className="h-40 w-full rounded-lg border-2 border-blue-400 p-2 outline-none focus-within:border-blue-600"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button
          className="btn-primary btn !h-[unset]"
          disabled={loading}
          type="submit"
        >
          {loading ? "loading" : "Post"}
        </button>
      </div>
      <span className="p-2 text-lg font-medium text-red-500">{error}</span>
    </form>
  )
}

export default CommentForm
