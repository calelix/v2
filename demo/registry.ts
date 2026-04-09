import type { Metadata } from "next"

import dynamic from "next/dynamic"

export const registry: Record<string, {
  name: string
  Component: React.ComponentType
  metadata: Metadata
}> = {
  "sidebar-01": {
    name: "sidebar-01",
    metadata: {
      title: "Sidebar 01",
      description: "Sidebar with layout fixed header",
    },
    Component: dynamic(() => import("./sidebar/sidebar-01-page").then((m) => m.Sidebar01Page)),
  },
}
