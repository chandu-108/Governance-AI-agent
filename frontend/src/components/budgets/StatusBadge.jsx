import React from 'react';

const statusConfig = {
  HEALTHY: {
    label: 'Healthy',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-500/20',
    dotClass: 'bg-emerald-500',
  },
  WARNING: {
    label: 'Warning',
    className: 'bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  CRITICAL: {
    label: 'Critical',
    className: 'bg-orange-50 text-orange-700 border border-orange-200 ring-1 ring-orange-500/25',
    dotClass: 'bg-orange-500 animate-pulse',
  },
  EXCEEDED: {
    label: 'Exceeded',
    className: 'bg-rose-50 text-rose-700 border border-rose-200 ring-1 ring-rose-500/25',
    dotClass: 'bg-rose-600',
  },
};

export const getBudgetStatus = (used, limit, warningThreshold = 80) => {
  if (!limit || limit <= 0) return 'HEALTHY';
  const percentage = (Number(used) / Number(limit)) * 100;
  if (percentage >= 100) return 'EXCEEDED';
  if (percentage >= 95) return 'CRITICAL';
  if (percentage >= warningThreshold) return 'WARNING';
  return 'HEALTHY';
};

const StatusBadge = ({ used, limit, warningThreshold = 80, overrideStatus, size = 'sm' }) => {
  let status = overrideStatus;
  if (!status) {
    status = getBudgetStatus(used, limit, warningThreshold);
  }
  const config = statusConfig[status.toUpperCase()] || statusConfig.HEALTHY;

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

export default StatusBadge;
