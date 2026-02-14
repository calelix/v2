"use client"

import Link from "next/link"

import {
  SidebarTrigger,
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
} from "@/shared/ui/shadcn/sidebar"

export const Sidebar01Page = () => {
  return (
    <SidebarProvider
      style={
        {
          "--header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <CraftSidebar />
      <header className="bg-background fixed top-0 left-0 z-50 flex w-full h-16 items-center gap-4 border-b px-4">
        <div className="flex items-center">
          <SidebarTrigger variant="outline" size="icon" />
        </div>
        <h2 className="text-base font-semibold">
          Sidebar with Layout Sticky Header
        </h2>
      </header>
      <div className="flex-1 flex flex-col overflow-hidden pt-16">
        <main className="flex-1 flex overflow-y-auto p-4">
          <div className="flex-1 flex">
            Content
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

const CraftSidebar = () => {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]">
      {/* Sidebar Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-muted hover:text-foreground">
              <Link href="#">
                Calelix Website
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Applications
          </SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-muted hover:text-foreground">
                  <Link href="#">
                    Blog
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-muted hover:text-foreground">
                  <Link href="#">
                    Moments
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            Craft Views
          </SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-muted hover:text-foreground">
                  <Link href="#">
                    Sidebar with Layout Sticky Header
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Sidebar Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              JGPARK
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
