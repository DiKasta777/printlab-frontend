import { BrowserRouter } from 'react-router';
import { AppRoutes } from '@/app/routes';
import { ErrorBoundary } from '@/shared/ui/error-boundary';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
