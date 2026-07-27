import React from 'react';

/* ─── Priority Badge ─────────────────────────────────────────────────── */
const priorityConfig = {
  0: {
    label: 'Low',
    className: 'bg-slate-50 text-slate-600 border border-slate-200 ring-1 ring-slate-400/10',
    dotClass: 'bg-slate-400',
  },
  1: {
    label: 'Medium',
    className: 'bg-sky-50 text-sky-700 border border-sky-200 ring-1 ring-sky-500/10',
    dotClass: 'bg-sky-500',
  },
  2: {
    label: 'High',
    className: 'bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-500/15',
    dotClass: 'bg-amber-500',
  },
  3: {
    label: 'Critical',
    className: 'bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-500/15',
    dotClass: 'bg-red-500',
  },
};

const getPriorityConfig = (priority) => {
  if (priority >= 3) return priorityConfig[3];
  if (priority === 2) return priorityConfig[2];
  if (priority === 1) return priorityConfig[1];
  return priorityConfig[0];
};

export const PriorityBadge = ({ priority, size = 'sm' }) => {
  const config = getPriorityConfig(priority);
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

/* ─── Status Badge ───────────────────────────────────────────────────── */
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
  draft: {
    label: 'Draft',
    className: 'bg-violet-50 text-violet-700 border border-violet-200 ring-1 ring-violet-500/10',
    dotClass: 'bg-violet-400',
  },
  archived: {
    label: 'Archived',
    className: 'bg-orange-50 text-orange-700 border border-orange-200 ring-1 ring-orange-500/10',
    dotClass: 'bg-orange-400',
  },
};

export const PolicyStatusBadge = ({ isActive, size = 'sm' }) => {
  const key = isActive ? 'active' : 'inactive';
  const config = statusConfig[key];
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

/* ─── Effect Badge ───────────────────────────────────────────────────── */
const effectConfig = {
  ALLOW: {
    label: 'Allow',
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  DENY: {
    label: 'Deny',
    className: 'bg-red-50 text-red-700 border border-red-200',
  },
};

export const EffectBadge = ({ effect }) => {
  const config = effectConfig[effect?.toUpperCase()] || effectConfig.ALLOW;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded ${config.className}`}
    >
      {config.label}
    </span>
  );
};
