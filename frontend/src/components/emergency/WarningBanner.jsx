import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon } from 'lucide-react';

const WarningBanner = ({ isEmergency, reason }) => {
  return (
    <AnimatePresence>
      {isEmergency && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          className="bg-red-600 overflow-hidden shadow-lg shadow-red-500/20"
        >
          <div className="px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
                <span className="flex p-2 rounded-lg bg-red-800">
                  <AlertOctagon className="h-5 w-5 text-white animate-pulse" aria-hidden="true" />
                </span>
                <p className="ml-3 font-medium text-white truncate">
                  <span className="md:hidden">EMERGENCY STOP ACTIVE</span>
                  <span className="hidden md:inline">
                    GLOBAL EMERGENCY STOP ACTIVATED. All agent operations are currently suspended.
                  </span>
                </p>
              </div>
              <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                <span className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white">
                  Reason: {reason || 'Administrator Override'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WarningBanner;
