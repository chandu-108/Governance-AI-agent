import React from 'react';
import { SearchX, History } from 'lucide-react';
import { motion } from 'framer-motion';

const AuditEmpty = ({ isFiltered, onClear }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white rounded-2xl border border-gray-200"
  >
    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 shadow-sm">
      {isFiltered ? (
        <SearchX className="h-8 w-8 text-gray-400" />
      ) : (
        <History className="h-8 w-8 text-gray-400" />
      )}
    </div>
    
    <h3 className="text-base font-semibold text-gray-900 mb-1">
      {isFiltered ? 'No matches found' : 'No activity recorded'}
    </h3>
    <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
      {isFiltered 
        ? "We couldn't find any audit logs matching your current filters. Try adjusting your search criteria or clearing filters." 
        : "Governance evaluation records will appear here automatically when agents attempt to perform actions."}
    </p>

    {isFiltered && (
      <button
        onClick={onClear}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
      >
        Clear Filters
      </button>
    )}
  </motion.div>
);

export default AuditEmpty;
