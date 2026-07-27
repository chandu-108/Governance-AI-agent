import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── 404 Not Found ─────────────────────────────────────────────────────────────
export const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full"
    >
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6 shadow-inner">
        <span className="text-4xl font-black text-gray-400 tracking-tighter">404</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        We couldn't find the page you were looking for. It may have been moved or doesn't exist.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors shadow-sm"
      >
        <Home className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </motion.div>
  </div>
);

// ─── Unauthorized ──────────────────────────────────────────────────────────────
export const UnauthorizedPage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full"
    >
      <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6">
        <ShieldAlert className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access denied</h1>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        You don't have permission to view this page. Contact your administrator if you believe this is an error.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors shadow-sm"
      >
        <Home className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </motion.div>
  </div>
);

// ─── Network Error ─────────────────────────────────────────────────────────────
export const NetworkErrorPage = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5">
        <AlertTriangle className="h-8 w-8 text-amber-500" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">Connection error</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
        Could not connect to the server. Please check your network and try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          Try again
        </button>
      )}
    </motion.div>
  </div>
);

// ─── Error Boundary ────────────────────────────────────────────────────────────
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-md w-full">
            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            <pre className="text-xs text-left bg-gray-900 text-gray-300 rounded-xl p-4 mb-6 overflow-x-auto">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Reload application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
