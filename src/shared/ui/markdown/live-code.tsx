"use client"

import * as React from "react"

import { transform as sucraseTransform } from "sucrase"

import { ErrorBoundary } from "../error-boundary/error-boundary"

interface LiveCodeProps {
  code?: string
  scope?: Record<string, unknown>
  onRender?: (error: Error | undefined) => void
}

export const LiveCode = ({
  code = "",
  scope = {},
  onRender = () => undefined,
}: LiveCodeProps) => {
  const [runtimeError, setRuntimeError] = React.useState<Error | undefined>(undefined)

  const result = React.useMemo(() => {
    try {
      const transformedCode = transform(code)
      const Preview = evaluate(transformedCode, {
        internal__onError: setRuntimeError,
        ...scope,
      })

      return {
        transformedCode,
        Preview,
        transformError: undefined,
      }
    } catch (error) {
      return {
        transformedCode: "",
        Preview: null,
        transformError: error as Error,
      }
    }
  }, [code, scope])

  const currentError = result.transformError || runtimeError

  React.useLayoutEffect(() => {
    onRender(currentError)
  }, [onRender, currentError])

  if (result.transformError) {
    return null
  }

  const { transformedCode, Preview } = result

  if (!Preview || Object(Preview) !== Preview) {
    return (
      <>
        {Preview}
      </>
    )
  }

  if (React.isValidElement(Preview)) {
    return (
      <ErrorBoundary
        key={transformedCode}
        onError={(error) => setRuntimeError(error)}
      >
        {Preview}
      </ErrorBoundary>
    )
  }

  if (typeof Preview === "function") {
    return (
      <ErrorBoundary
        key={transformedCode}
        onError={(error) => setRuntimeError(error)}
      >
        <Preview />
      </ErrorBoundary>
    )
  }

  return null
}

const evaluate = (code = "", scope: Record<string, unknown> = {}) => {
  const scopeKeys = Object.keys(scope)
  const scopeValues = scopeKeys.map((key) => scope[key])

  const fn = new Function("React", ...scopeKeys, code)
  const result = fn(React, ...scopeValues)

  return injectReactClassComponentPrototype(result, code)
}

const transform = (code = "") => {
  const expression = code.trim().replace(/;$/, "")

  if (expression) {
    const withoutImports = removeImports(expression)
    const withFragment = injectFragment(withoutImports)
    const withReturn = injectReturnTryCatch(withFragment)
    const transformed = sucraseTransform(withReturn, {
      transforms: ["jsx", "typescript"],
    }).code

    return transformed
  }

  return ""
}

const injectFragment = (code = "") => {
  return /^<[^]*>$/m.test(code) ? `<>${code}</>` : code
}

const injectReturnTryCatch = (code = "") => {
  let regexp: RegExp
  const catchBlock = "catch (error) { internal__onError(error) return null }"

  regexp = /^(class\s+)(\w+)(\s+extends\s+React\.Component)(\s*\{[^]+)/m
  if (regexp.test(code)) {
    return code.replace(regexp, `return (function $2 () { try { ${code} return new $2() } ${catchBlock} })`)
  }

  regexp = /^(function(\s+\w*\s*)?\([^]*?\)\s*\{)([^]+)(\})/m
  if (regexp.test(code)) {
    return code.replace(regexp, `return ($1 try { $3 } ${catchBlock} })`)
  }

  regexp = /^((?:\([^]*?\)|\w+)\s*=>\s*\{)([^]+)(\})/m
  if (regexp.test(code)) {
    return code.replace(regexp, `return ($1 try { $2 } ${catchBlock} })`)
  }

  regexp = /^((?:\([^]*?\)|\w+)\s*=>\s*)([^]+)/m
  if (regexp.test(code)) {
    return code.replace(regexp, `return ($1 { try { return $2 } ${catchBlock}})`)
  }

  return `return (${code})`
}

const injectReactClassComponentPrototype = (fn: () => null, code = "") => {
  const regexp = /(class\s+)(\w+)(\s+extends\s+React\.Component)(\s*\{[^]+)/m

  if (regexp.test(code)) {
    fn.prototype = React.Component.prototype
  }

  return fn
}

const removeImports = (code = "") => {
  return code.replace(/^(import .+?|'|")$/gms, "")
}
