import React from 'react';
import { ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PolicyEmptyState = ({ onCreateClick, isFiltered }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 px-8 text-center"
  >
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center">
        <ShieldCheck className="h-10 w-10 text-violet-400" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
        <Sparkles className="h-3 w-3 text-white" />
      </div>
    </div>
    {isFiltered ? (
      <>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No policies match your filters</h3>
        <p className="text-sm text-gray-500 max-w-xs mb-0 leading-relaxed">
          Try adjusting your search query, type, or status filters.
        </p>
      </>
    ) : (
      <>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No policies defined</h3>
        <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
          Policies control what actions your AI agents are permitted or denied within the governance layer.
        </p>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-sm shadow-violet-500/20"
        >
          <Plus className="h-4 w-4" />
          Create First Policy
        </button>
      </>
    )}
  </motion.div>
);

export default PolicyEmptyState;
