import Header from "@/components/Header"
import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/logo.svg" />
        <title>Lireddit next</title>
      </Head>
      <body className="min-h-screen min-w-full bg-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
