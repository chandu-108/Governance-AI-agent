import React from 'react';
import { Lock, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PermissionEmptyState = ({ onCreateClick, isFiltered }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 px-8 text-center"
  >
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center">
        <Lock className="h-10 w-10 text-teal-400" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
        <Sparkles className="h-3 w-3 text-white" />
      </div>
    </div>
    {isFiltered ? (
      <>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No permissions match</h3>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
          Try adjusting your search or filter criteria.
        </p>
      </>
    ) : (
      <>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No permissions assigned</h3>
        <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
          Permissions define what level of access each user has to specific AI agents. Assign your first permission to get started.
        </p>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all shadow-sm shadow-teal-500/20"
        >
          <Plus className="h-4 w-4" />
          Assign First Permission
        </button>
      </>
    )}
  </motion.div>
);

export default PermissionEmptyState;
