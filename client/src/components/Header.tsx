import Link from "next/link"
const Header = () => {
  return (
    <header className="w-full bg-zinc-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <img src="/logo.svg" alt="logo" className="" />
        <nav className="flex gap-3">
          <Link href={"/login"} className="btn-outline btn rounded-full">
            login
          </Link>
          <Link href={"/signup"} className="btn-primary btn rounded-full">
            sign up
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
