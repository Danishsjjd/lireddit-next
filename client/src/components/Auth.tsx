import { useLoginMutation } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import { useForm } from "react-hook-form"
import Input from "./Input"

type FormData = {
  username: string
  email?: string
  password: string
}

const Auth = () => {
  const { mutate: LoginFunc } = useLoginMutation(graphqlRequest)
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<FormData>({})

  const onSubmit = (data: FormData) => {
    const { password, username } = data

    LoginFunc({ options: { password, usernameOrEmail: username } })
  }

  return (
    <section className="grid min-h-screen min-w-full place-items-center bg-slate-900">
      <main className="mx-auto max-w-xl ">
        <div className="mb-4 flex flex-col items-center justify-center gap-3">
          <img src="/logo.svg" alt="logo" className="w-20" />
          <h3 className="text-4xl">Login</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* <Input<FormData>
            errors={errors}
            register={register}
            name="email"
            title="Enter Email"
            type={"email"}
          /> */}
          <Input<FormData>
            errors={errors}
            register={register}
            name="username"
            title="Enter Username Or Email"
            type={"text"}
            // validations={{
            //   pattern: {
            //     value: /^[^@]+$/,
            //     message: "username must not contains @ sign",
            //   },
            // }}
          />
          <Input<FormData>
            errors={errors}
            register={register}
            name="password"
            title="Enter Password"
            type={"password"}
          />
          <button type="submit" className="btn-primary btn w-full">
            Login
          </button>
        </form>
      </main>
    </section>
  )
}

export default Auth
