import "@/styles/globals.css"
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type { AppProps } from "next/app"
import { useState } from "react"

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      {process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  )
}
