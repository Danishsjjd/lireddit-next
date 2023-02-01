import { ErrorMessage } from "@hookform/error-message"
import {
  DeepMap,
  FieldError,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form"

type InputProps<T extends {}> = {
  title: string
  type: React.HTMLInputTypeAttribute
  errors: Partial<DeepMap<T, FieldError>>
  name: Path<T>
  register: UseFormRegister<T>
  className?: string
  validations?: RegisterOptions
}

const Input = <T extends {}>({
  title,
  type,
  className,
  name,
  register,
  validations,
  errors,
  ...props
}: InputProps<T>) => {
  return (
    <label className="mb-3 w-full">
      <h3 className="pb-1 text-lg font-medium text-white">{title}</h3>
      <input
        type={type}
        className={`${
          className ? className : ""
        } input-bordered input w-full min-w-[23rem]`}
        {...register(name, validations)}
        {...props}
      />
      <ErrorMessage
        errors={errors}
        name={name as any}
        render={({ message }) => {
          return <p className="mt-1 text-red-600">{message}</p>
        }}
      />
    </label>
  )
}

export default Input
