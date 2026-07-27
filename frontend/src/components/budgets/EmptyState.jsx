import React from 'react';
import { CreditCard, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ onCreateClick, isFiltered }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 px-8 text-center"
  >
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center">
        <CreditCard className="h-10 w-10 text-violet-500" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center">
        <Sparkles className="h-3 w-3 text-white" />
      </div>
    </div>
    {isFiltered ? (
      <>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No budgets match your filters</h3>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
          Try adjusting your search criteria, range, or agent filters.
        </p>
      </>
    ) : (
      <>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No spending limits set</h3>
        <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
          Configure financial limits for your AI agents to automatically enforce resource guardrails.
        </p>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-sm shadow-violet-500/20"
        >
          <Plus className="h-4 w-4" />
          Set First Budget
        </button>
      </>
    )}
  </motion.div>
);

export default EmptyState;
