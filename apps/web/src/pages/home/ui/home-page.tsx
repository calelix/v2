import { HomeHeader } from "@/widgets/header"
import { HomeFooter } from "@/widgets/footer"
// import { MENU_ITEMS } from "../config/menu-items"
// import { MenuItem } from "./menu-item"

export const HomePage = () => {

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <HomeHeader />

      <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto">

        {/* Hero Section */}
        <section className="mb-20">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tighter">
              <span>
                Abstract
              </span>
              <br />
              <span className="text-border dark:text-accent">
                Impression
              </span>
            </h1>
            <div className="flex gap-2 items-center">
              <div className="w-16 h-px bg-border dark:bg-accent" />
              <p className="text-muted-foreground font-light text-sm">
                선과 텍스트의 결
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg font-light text-foreground leading-relaxed max-w-2xl">
              복잡함을 걷어내고 본질만 남기다.
            </p>
            <p className="text-sm text-muted-foreground font-light max-w-3xl leading-relaxed">
              복잡함을 제거하고 간단한 형태로 담을 수 있도록. 불필요한 것들을 제거하고 본질에 집중하여 인상을 남길 수 있도록 생각합니다.
            </p>
          </div>

          <div className="mt-16 space-y-2">
            <div className="w-full h-px bg-gradient-to-r from-primary via-primary to-transparent opacity-40" />
            <div className="w-2/3 h-px bg-gradient-to-r from-primary to-transparent opacity-20" />
          </div>
        </section>

        {/* <section className="mt-24 mb-32">
          <div className="mb-12">
            <h2 className="text-2xl font-light tracking-wider text-primary mb-2">
              Explore
            </h2>
            <div className="w-12 h-px bg-accent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {MENU_ITEMS.map((item) => <MenuItem key={item.id} item={item} />)}
          </div>
        </section> */}

        <div className="my-24 relative">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary via-50% to-transparent opacity-20" />
        </div>

        <HomeFooter />
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
    </main>
  )
}
