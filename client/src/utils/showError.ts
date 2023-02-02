import { UseFormSetError } from "react-hook-form"

export default function errorsKeys<T extends {}>(
  setError: UseFormSetError<T>,
  err: { field: any; message: string }[]
) {
  err.map(({ field, message }) => {
    setError(field, { message })
  })
}
