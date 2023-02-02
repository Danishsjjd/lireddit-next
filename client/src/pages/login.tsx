import Input from "@/components/Input"
import { MeQuery, useLoginMutation } from "@/generated/graphql"
import usePublicRoute from "@/hooks/usePublicRoute"
import graphqlRequest from "@/libs/graphqlRequest"
import errorsKeys from "@/utils/showError"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { RotatingLines } from "react-loader-spinner"

type LoginFormData = {
  usernameOrEmail: string
  password: string
}

const Login = () => {
  const router = useRouter()
  const { isLoading } = usePublicRoute(router)

  const queryClient = useQueryClient()
  const { next } = router.query
  const { mutate: LoginFunc } = useLoginMutation(graphqlRequest)
  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    setError,
  } = useForm<LoginFormData>({})

  const onSubmit = (data: LoginFormData) => {
    const { password, usernameOrEmail } = data

    LoginFunc(
      { options: { password, usernameOrEmail } },
      {
        onSuccess(data) {
          if (data.login.errors) return errorsKeys(setError, data.login.errors)

          if (data.login.user) {
            queryClient.setQueryData<MeQuery>(["me"], (queryData) => {
              if (data.login.user)
                return { me: { user: { ...data.login.user } } }

              return queryData
            })
          }
        },
      }
    )
  }

  return (
    <section className="grid min-h-screen min-w-full place-items-center bg-slate-900">
      {isLoading ? (
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      ) : (
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
            <Input<LoginFormData>
              errors={errors}
              register={register}
              name="usernameOrEmail"
              title="Enter Username Or Email"
              type={"text"}
              // validations={{
              //   pattern: {
              //     value: /^[^@]+$/,
              //     message: "username must not contains @ sign",
              //   },
              // }}
              validations={{
                required: {
                  message: "required",
                  value: true,
                },
              }}
            />
            <Input<LoginFormData>
              errors={errors}
              register={register}
              name="password"
              title="Enter Password"
              type={"password"}
              validations={{
                required: {
                  message: "required",
                  value: true,
                },
              }}
            />
            <button
              type="submit"
              className={`btn-primary btn w-full ${isSubmitting && "loading"}`}
            >
              Login
            </button>
          </form>
        </main>
      )}
    </section>
  )
}

export default Login
