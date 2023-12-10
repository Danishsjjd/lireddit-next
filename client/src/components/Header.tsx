import { MeQuery, useLogoutMutation, useMeQuery } from "@/generated/graphql"
import graphqlRequest from "@/libs/graphqlRequest"
import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
const Header = () => {
  const queryClient = useQueryClient()
  const { data: user } = useMeQuery(graphqlRequest)
  const { mutate: logoutFunc } = useLogoutMutation(graphqlRequest)

  const logoutHandler = () => {
    logoutFunc(
      {},
      {
        onSuccess(data) {
          if (data.logout)
            queryClient.setQueryData<MeQuery>(["me"], () => {
              return { me: { user: null } }
            })
        },
      }
    )
  }

  return (
    <header className="w-full bg-zinc-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link href={"/"}>
          <Image width={50} height={50} src="/logo.svg" alt="logo" className="" />
        </Link>
        <nav className="flex gap-3">
          {user?.me.user?.id ? (
            <div className="flex items-center gap-3">
              <span className="font-medium lowercase text-white">{user.me.user.username}</span>
              <button className="btn-outline btn rounded-full" onClick={logoutHandler}>
                logout
              </button>
            </div>
          ) : (
            <>
              <Link href={"/login"} className="btn-outline btn rounded-full">
                login
              </Link>
              <Link href={"/signup"} className="btn-primary btn rounded-full">
                sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
