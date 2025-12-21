import { Header } from "@/widgets/header"

export const BlogHomePage = () => {

  return (
    <>
      <Header className="py-14" />
      <main className="w-full max-w-4xl mx-auto h-svh">
        <div className="flex flex-col">
          <h1 className="text-base font-bold">
            Powered by Caffeine & Confusion
          </h1>
          <p className="mt-4 text-xs/relaxed text-muted-foreground">
            Can{"'"}t start my day without Americano. For real. One cup to wake up, two to function, three for... just habit. Every post here is written by a caffeine lover.
          </p>
        </div>
      </main>
    </>
  )
}
