import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  dashboard: 'Dashboard',
  agents: 'Agents',
  policies: 'Policies',
  permissions: 'Permissions',
  budgets: 'Budgets',
  governance: 'Governance',
  audit: 'Audit Logs',
  emergency: 'Emergency Kill Switch',
  profile: 'User Profile',
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm text-gray-500">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = routeNameMap[value.toLowerCase()] || value;

          return (
            <li key={to} className="inline-flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
              {isLast ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="text-gray-600 hover:text-gray-900 transition-colors capitalize"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
