import { Component, ReactNode, ErrorInfo } from 'react';
import { ErrorBoundary as ErrorBoundarySentry } from '@sentry/react';
import React from 'react';


interface OwnProps {
  errorMessageCallback: (error: any) => void;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<OwnProps, State> {
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const { errorMessageCallback } = this.props;

    errorMessageCallback([
      error.toString(),
      info.componentStack
        .split('\n')
        .map((line) => line.trim())
        .find((line) => !!line),
    ].join(' '));

    // eslint-disable-next-line no-console
    console.error(error);
  }

  render(): ReactNode {
    const { children } = this.props;
    return <ErrorBoundarySentry>{children}</ErrorBoundarySentry>;
  }
}

export default ErrorBoundary;
