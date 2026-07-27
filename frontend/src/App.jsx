import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary, NotFoundPage } from './components/ui/ErrorPages';
import GlobalLayout from './layouts/GlobalLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// ── Authentication Pages (eager - always needed fast)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// ── Route-based lazy-loaded pages ──────────────────────────────────────────────
const Dashboard   = lazy(() => import('./pages/Dashboard'));
const Agents      = lazy(() => import('./pages/Agents'));
const Policies    = lazy(() => import('./pages/Policies'));
const Permissions = lazy(() => import('./pages/Permissions'));
const Budgets     = lazy(() => import('./pages/Budgets'));
const Governance  = lazy(() => import('./pages/Governance'));
const AuditLogs   = lazy(() => import('./pages/AuditLogs'));
const Emergency   = lazy(() => import('./pages/Emergency'));
const Profile     = lazy(() => import('./pages/Profile'));
const Settings    = lazy(() => import('./pages/Settings'));

// ── Loading fallback ────────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center h-64" role="status" aria-label="Loading page">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
  </div>
);

// ── Optimised Query Client ──────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* ── Public Routes */}
                <Route path="/login"           element={<Login />} />
                <Route path="/register"        element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* ── Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<GlobalLayout />}>
                    <Route
                      path="/dashboard"
                      element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>}
                    />
                    <Route
                      path="/agents"
                      element={<Suspense fallback={<PageLoader />}><Agents /></Suspense>}
                    />
                    <Route
                      path="/policies"
                      element={<Suspense fallback={<PageLoader />}><Policies /></Suspense>}
                    />
                    <Route
                      path="/permissions"
                      element={<Suspense fallback={<PageLoader />}><Permissions /></Suspense>}
                    />
                    <Route
                      path="/budgets"
                      element={<Suspense fallback={<PageLoader />}><Budgets /></Suspense>}
                    />
                    <Route
                      path="/governance"
                      element={<Suspense fallback={<PageLoader />}><Governance /></Suspense>}
                    />
                    <Route
                      path="/audit"
                      element={<Suspense fallback={<PageLoader />}><AuditLogs /></Suspense>}
                    />
                    <Route
                      path="/emergency"
                      element={<Suspense fallback={<PageLoader />}><Emergency /></Suspense>}
                    />
                    <Route
                      path="/profile"
                      element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>}
                    />
                    <Route
                      path="/settings"
                      element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>}
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Route>
                </Route>

                {/* ── 404 Catch-all */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
