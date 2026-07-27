import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ percentage }) => {
  const pct = Math.min(100, Math.max(0, percentage));

  // Determine color matching healthy, warning, critical, exceeded
  let barColor = 'bg-emerald-500';
  if (pct >= 100) {
    barColor = 'bg-rose-500';
  } else if (pct >= 95) {
    barColor = 'bg-orange-500';
  } else if (pct >= 80) {
    barColor = 'bg-amber-500';
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-gray-500 font-medium">Utilization</span>
        <span className="text-gray-900 font-semibold">{pct.toFixed(1)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
