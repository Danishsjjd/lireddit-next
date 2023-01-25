import { createContext, ReactNode } from "react"

type Props = {
  children: ReactNode
}

const PostContext = createContext("post")

export function PostProvider({ children }: Props) {
  return <PostContext.Provider value="str">{children}</PostContext.Provider>
}
