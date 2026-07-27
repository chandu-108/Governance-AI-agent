import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Bot,
  Shield,
  Lock,
  Wallet,
  Activity,
  AlertTriangle,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
  GitBranch,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Platform',
    items: [
      { path: '/agents',      label: 'Agents',      icon: Bot },
      { path: '/policies',    label: 'Policies',    icon: Shield },
      { path: '/permissions', label: 'Permissions', icon: Lock },
      { path: '/budgets',     label: 'Budgets',     icon: Wallet },
    ],
  },
  {
    label: 'Governance',
    items: [
      { path: '/governance', label: 'Evaluation', icon: Zap },
      { path: '/audit',      label: 'Audit Logs', icon: Activity },
      { path: '/emergency',  label: 'Emergency',  icon: AlertTriangle, danger: true },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/profile',  label: 'Profile',  icon: User },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const NavItem = ({ item, isCollapsed, onClick }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) => [
        'sidebar-nav-item group relative',
        isActive ? 'active' : '',
        item.danger ? 'hover:!text-red-400 hover:!bg-red-500/10' : '',
      ].join(' ')}
      title={isCollapsed ? item.label : undefined}
    >
      <Icon
        className={[
          'flex-shrink-0 transition-colors',
          item.danger ? 'group-hover:text-red-400' : '',
        ].join(' ')}
        size={16}
        strokeWidth={1.8}
      />
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden whitespace-nowrap text-[13px]"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip when collapsed */}
      {isCollapsed && (
        <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-gray-700">
            {item.label}
          </div>
        </div>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isCollapsed, toggleCollapse, mobileOpen, closeMobile }) => {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 60 : 228 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className={[
          'sidebar-root fixed inset-y-0 left-0 z-50 flex-shrink-0',
          'lg:relative lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{ width: isCollapsed ? 60 : 228 }}
      >
        {/* Logo Area */}
        <div className="sidebar-logo-area gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/30">
            <GitBranch size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <span className="text-[14px] font-bold tracking-tight text-white whitespace-nowrap">
                  Governance
                </span>
                <span className="text-[14px] font-bold tracking-tight text-indigo-400"> Layer</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile close */}
          <button
            onClick={closeMobile}
            className="ml-auto p-1 rounded-md text-gray-600 hover:text-white hover:bg-gray-800 transition-colors lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-1">
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="sidebar-section-label overflow-hidden"
                  >
                    {group.label}
                  </motion.div>
                )}
              </AnimatePresence>
              {group.items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  isCollapsed={isCollapsed}
                  onClick={closeMobile}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="flex-shrink-0 border-t border-gray-800 p-2">
          <div className={[
            'flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-gray-800/60 cursor-pointer',
            isCollapsed ? 'justify-center' : '',
          ].join(' ')}>
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-[11px] font-bold flex-shrink-0">
              {initials}
            </div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden min-w-0"
                >
                  <p className="text-[12px] font-medium text-white truncate leading-tight whitespace-nowrap">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate whitespace-nowrap">
                    {user?.is_admin ? 'Administrator' : 'Standard User'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collapse toggle — desktop only */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-full mt-2 p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
