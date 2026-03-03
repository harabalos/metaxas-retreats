import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-sand/10 px-4 text-center">
          <h1 className="text-2xl font-heading font-bold text-forest-dark mb-3">Something went wrong</h1>
          <p className="text-gray-500 mb-6 max-w-md">
            An unexpected error occurred. Please refresh the page or go back to the homepage.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-forest text-white rounded-md hover:bg-forest-dark transition-colors"
            >
              Refresh page
            </button>
            <a
              href="/"
              className="px-4 py-2 border border-forest text-forest rounded-md hover:bg-forest/10 transition-colors"
            >
              Go to homepage
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
