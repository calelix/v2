import * as React from "react"
import Link from "next/link"

import * as Button from "../shadcn/button"
import * as Tooltip from "../shadcn/tooltip"

type LiveScope = Record<string, unknown>

export const liveCodeScope: LiveScope = {
  React,
  Link,
  ...Button,
  ...Tooltip,
}
