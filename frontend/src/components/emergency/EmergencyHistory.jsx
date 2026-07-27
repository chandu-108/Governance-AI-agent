import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldAlert, Bot, History } from 'lucide-react';
import { format } from 'date-fns';

const EmergencyHistory = ({ agentStops, agents }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <History className="h-4 w-4 text-indigo-500" />
          Active Agent Suspensions
        </h3>
        <span className="text-xs font-semibold text-white bg-indigo-500 px-2 py-0.5 rounded-full">
          {agentStops.length} Active
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {agentStops.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <ShieldAlert className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">No Agent Suspensions</p>
            <p className="text-xs text-gray-500">All individual agents are operating normally without specific emergency overrides.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {agentStops.map((stop, idx) => {
                const agent = agents.find(a => a.id === stop.agent_id);
                const agentName = agent?.name || `Agent #${stop.agent_id}`;
                
                return (
                  <motion.div
                    key={stop.agent_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-red-100 bg-red-50/30"
                  >
                    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                      <Bot className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{agentName}</p>
                        <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(stop.updated_at), 'HH:mm:ss')}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-800 mb-1">
                        Triggered by User #{stop.enabled_by}
                      </p>
                      <p className="text-xs text-red-700 bg-red-50 p-2 rounded-lg border border-red-100">
                        "{stop.reason}"
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyHistory;
