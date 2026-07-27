import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Menu, User, Settings, LogOut, ChevronDown,
  Command, Search, ShieldAlert,
} from 'lucide-react';
import Breadcrumb from './Breadcrumb';

const ROUTE_META = {
  '/dashboard':   { title: 'Dashboard',    subtitle: 'Platform overview & key metrics' },
  '/agents':      { title: 'Agents',       subtitle: 'Manage AI agent registry' },
  '/policies':    { title: 'Policies',     subtitle: 'Configure governance policies' },
  '/permissions': { title: 'Permissions',  subtitle: 'Role-based access control' },
  '/budgets':     { title: 'Budgets',      subtitle: 'Financial allocation & limits' },
  '/governance':  { title: 'Evaluation',   subtitle: 'Real-time governance engine' },
  '/audit':       { title: 'Audit Logs',   subtitle: 'Immutable activity records' },
  '/emergency':   { title: 'Mission Control', subtitle: 'Emergency kill switch & status' },
  '/profile':     { title: 'Profile',      subtitle: 'Account information' },
  '/settings':    { title: 'Settings',     subtitle: 'Preferences & configuration' },
};

// ── User Dropdown ────────────────────────────────────────────────────────────
const UserDropdown = ({ user, logout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'U';

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shadow-sm flex-shrink-0">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-[13px] font-semibold text-gray-900 leading-tight">{user?.name || 'User'}</p>
          <p className="text-[11px] text-gray-500 leading-tight">{user?.is_admin ? 'Administrator' : 'Member'}</p>
        </div>
        <ChevronDown
          size={14}
          className={`hidden md:block text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
            role="menu"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-[13px] font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">{user?.email}</p>
            </div>

            <div className="p-1">
              {[
                { label: 'View Profile', icon: User,     action: () => { navigate('/profile');  setOpen(false); } },
                { label: 'Settings',     icon: Settings,  action: () => { navigate('/settings'); setOpen(false); } },
              ].map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  role="menuitem"
                  className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <Icon size={14} className="text-gray-400" />
                  {label}
                </button>
              ))}

              <div className="my-1 border-t border-gray-100" />

              <button
                onClick={() => { logout(); setOpen(false); }}
                role="menuitem"
                className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ toggleMobile }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const meta = ROUTE_META[location.pathname] || { title: 'Governance Layer', subtitle: '' };
  const isEmergency = location.pathname === '/emergency';

  return (
    <header className="navbar-root">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="lg:hidden btn-ghost p-2"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-[15px] font-semibold text-gray-900 leading-tight tracking-tight">
            {meta.title}
          </h1>
          {meta.subtitle && (
            <p className="text-[11px] text-gray-400 leading-tight hidden sm:block">{meta.subtitle}</p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Status chip — Emergency indicator */}
        {isEmergency && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-semibold">
            <ShieldAlert size={12} className="animate-pulse" />
            Mission Control
          </div>
        )}

        {/* Notification Bell */}
        <button
          className="relative btn-ghost p-2 rounded-lg"
          aria-label="Notifications"
        >
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* User Dropdown */}
        <UserDropdown user={user} logout={logout} />
      </div>
    </header>
  );
};

export default Navbar;
