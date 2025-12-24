import * as React from "react"
import Link from "next/link"

import * as Button from "../../ui/shadcn/button"
import * as Tooltip from "../../ui/shadcn/tooltip"

type LiveScope = Record<string, unknown>

export const liveCodeScope: LiveScope = {
  React,
  Link,
  ...Button,
  ...Tooltip,
}
