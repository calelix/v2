import * as React from "react"

interface ErrorBoundaryProps extends Omit<React.ComponentProps<"div">, "onError"> {
  children?: React.ReactNode
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode)
  onError?: (error: Error) => void
}

interface ErrorBoundaryState {
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  override componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  resetError = () => {
    this.setState({ error: undefined })
  }

  override render() {
    const { fallback, children } = this.props

    if (this.state.error) {
      if (typeof fallback === "function") {
        return fallback(this.state.error, this.resetError)
      }

      if (fallback) {
        return fallback
      }

      return null
    }

    return children
  }
}
