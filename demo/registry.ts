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
  "media-device-01": {
    name: "media-device-01",
    metadata: {
      title: "Media Device 01",
      description: "Basic media device example",
    },
    Component: dynamic(() => import("./media-device/media-device-01-page").then((m) => m.MediaDevice01Page)),
  },
}
