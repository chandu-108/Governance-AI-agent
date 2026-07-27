import React from 'react';
import { Bot, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AgentEmptyState = ({ onCreateClick, isFiltered }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-8 text-center"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <Bot className="h-10 w-10 text-blue-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
      </div>

      {isFiltered ? (
        <>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No results found</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
            No agents match your current filters. Try adjusting your search or status filter.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No agents registered</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
            Agents are the core of your governance system. Register your first AI agent to start
            managing access policies and budgets.
          </p>
        </>
      )}

      {!isFiltered && (
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" />
          Register First Agent
        </button>
      )}
    </motion.div>
  );
};

export default AgentEmptyState;
