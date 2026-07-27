import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, PauseCircle } from 'lucide-react';

const statusConfig = {
  ACTIVE: {
    label: 'Active',
    icon: CheckCircle,
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-500/20',
    dotClass: 'bg-emerald-500',
    iconClass: 'text-emerald-500',
  },
  INACTIVE: {
    label: 'Inactive',
    icon: XCircle,
    className: 'bg-gray-50 text-gray-600 border border-gray-200 ring-1 ring-gray-400/20',
    dotClass: 'bg-gray-400',
    iconClass: 'text-gray-400',
  },
  PAUSED: {
    label: 'Paused',
    icon: PauseCircle,
    className: 'bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-500/20',
    dotClass: 'bg-amber-500',
    iconClass: 'text-amber-500',
  },
};

const StatusBadge = ({ status, size = 'sm' }) => {
  const config = statusConfig[status?.toUpperCase()] || statusConfig.INACTIVE;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.className} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dotClass} ${
          status?.toUpperCase() === 'ACTIVE' ? 'animate-pulse' : ''
        }`}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;
