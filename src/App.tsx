import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { VehicleSelectionProvider } from './context/VehicleSelectionContext';
import { AppLayout } from './components/layout/AppLayout';
import { pages } from './pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VehicleSelectionProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {pages.map(({ path, component: Page }) => (
                <Route key={path} path={path} element={<Page />} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </VehicleSelectionProvider>
    </QueryClientProvider>
  );
}

export default App;
