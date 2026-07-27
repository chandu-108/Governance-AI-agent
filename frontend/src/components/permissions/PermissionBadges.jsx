import React from 'react';
import { Eye, Pencil, Terminal, ShieldAlert } from 'lucide-react';

/* ─── Permission Type Badge ──────────────────────────────────────────── */
const permConfig = {
  READ: {
    label: 'Read',
    icon: Eye,
    className: 'bg-sky-50 text-sky-700 border border-sky-200 ring-1 ring-sky-500/10',
    dotClass: 'bg-sky-500',
  },
  WRITE: {
    label: 'Write',
    icon: Pencil,
    className: 'bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-500/10',
    dotClass: 'bg-amber-500',
  },
  EXECUTE: {
    label: 'Execute',
    icon: Terminal,
    className: 'bg-violet-50 text-violet-700 border border-violet-200 ring-1 ring-violet-500/10',
    dotClass: 'bg-violet-500',
  },
  ADMIN: {
    label: 'Admin',
    icon: ShieldAlert,
    className: 'bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-500/15',
    dotClass: 'bg-red-500',
  },
};

export const PermissionTypeBadge = ({ permission, size = 'sm' }) => {
  const config = permConfig[permission?.toUpperCase()] || permConfig.READ;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.className} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <Icon className="h-3 w-3 flex-shrink-0" />
      {config.label}
    </span>
  );
};

/* ─── Status Badge (Grant Status) ────────────────────────────────────── */
const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-500/20',
    dotClass: 'bg-emerald-500 animate-pulse',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-50 text-gray-500 border border-gray-200 ring-1 ring-gray-400/10',
    dotClass: 'bg-gray-400',
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-50 text-yellow-700 border border-yellow-200 ring-1 ring-yellow-500/10',
    dotClass: 'bg-yellow-500',
  },
  revoked: {
    label: 'Revoked',
    className: 'bg-red-50 text-red-600 border border-red-200 ring-1 ring-red-500/10',
    dotClass: 'bg-red-500',
  },
};

export const PermissionStatusBadge = ({ status = 'active', size = 'sm' }) => {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.active;
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.className} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotClass}`} />
      {config.label}
    </span>
  );
};
