import Input from "@/components/Input"
import { MeQuery, useSignupMutation } from "@/generated/graphql"
import usePublicRoute from "@/hooks/usePublicRoute"
import graphqlRequest from "@/libs/graphqlRequest"
import errorsKeys from "@/utils/showError"
import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { RotatingLines } from "react-loader-spinner"

type FormData = {
  username: string
  email: string
  password: string
}

const Signup = () => {
  const router = useRouter()
  const { isLoading } = usePublicRoute(router)
  const queryClient = useQueryClient()
  const { next } = router.query
  const { mutate: LoginFunc } = useSignupMutation(graphqlRequest)
  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    setError,
  } = useForm<FormData>({})

  const onSubmit = (data: FormData) => {
    const { password, email, username } = data

    LoginFunc(
      { options: { password, email, username } },
      {
        onSuccess(data) {
          if (data.signup.errors) return errorsKeys(setError, data.signup.errors)

          if (data.signup.user) {
            queryClient.setQueryData<MeQuery>(["me"], (queryData) => {
              if (data.signup.user) return { me: { user: { ...data.signup.user } } }

              return queryData
            })
            router.replace((next as string) || "/")
          }
        },
      }
    )
  }

  return (
    <section className="grid min-h-screen min-w-full place-items-center bg-slate-900">
      {isLoading ? (
        <RotatingLines strokeColor="grey" strokeWidth="5" animationDuration="0.75" width="96" visible={true} />
      ) : (
        <main className="mx-auto max-w-xl ">
          <div className="mb-4 flex flex-col items-center justify-center gap-3">
            <Image width={80} height={80} src="/logo.svg" alt="logo" className="w-20" />
            <h3 className="text-4xl">Login</h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <Input<FormData>
              errors={errors}
              register={register}
              name="email"
              title="Enter Email"
              type={"email"}
              validations={{
                required: {
                  message: "required",
                  value: true,
                },
              }}
            />
            <Input<FormData>
              errors={errors}
              register={register}
              name="username"
              title="Enter Username"
              type={"text"}
              validations={{
                pattern: {
                  value: /^[^@]+$/,
                  message: "username must not contains @ sign",
                },
                required: {
                  value: true,
                  message: "required",
                },
              }}
            />
            <Input<FormData>
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
            <button type="submit" className={`btn-primary btn w-full ${isSubmitting && "loading"}`}>
              Login
            </button>
          </form>
        </main>
      )}
    </section>
  )
}

export default Signup
