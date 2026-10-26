import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { VehicleSelectionProvider } from './context/VehicleSelectionContext';
import { AppLayout } from './components/layout/AppLayout';
import { pages } from './pages';
import { LoginPage } from './pages/LoginPage';
import { getToken } from './api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 2,
    },
  },
});

// Componente propio para que el token se revise en cada navegación, no solo al montar App
function RequireAuth() {
  return getToken() ? <AppLayout /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VehicleSelectionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
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
