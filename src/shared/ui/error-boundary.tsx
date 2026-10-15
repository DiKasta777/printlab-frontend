import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <main className="message-page" role="alert">
          <p className="eyebrow">PrintLab</p>
          <h1>Не удалось открыть приложение</h1>
          <p>Попробуйте перезагрузить страницу.</p>
          <button
            className="button"
            onClick={() => {
              window.location.reload();
            }}
            type="button"
          >
            Перезагрузить
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
