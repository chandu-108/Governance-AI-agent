import React from 'react';
import { format } from 'date-fns';
import { ShieldCheck, ShieldAlert, History, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const AuditSummary = ({ logs = [], agents = [] }) => {
  return (
    <Card className="h-full border-gray-200 shadow-sm relative overflow-hidden bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <History className="h-4 w-4 text-purple-600" />
          Recent Evaluations
        </CardTitle>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          Live Audit Log
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              <Activity className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              No recent evaluation logs found.
            </div>
          ) : (
            <AnimatePresence>
              {logs.slice(0, 10).map((log, idx) => {
                const agent = agents.find(a => a.id === log.agent_id);
                const isAllow = log.decision === 'ALLOW';
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAllow ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {isAllow ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {agent?.name || `Agent #${log.agent_id}`}
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {format(new Date(log.created_at), 'HH:mm:ss')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                          {log.action}
                        </span>
                        <span className={`text-xs font-medium ${isAllow ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isAllow ? 'Allowed' : 'Denied'}
                        </span>
                      </div>
                      {!isAllow && log.reason && (
                        <p className="text-xs text-red-500 mt-1 truncate" title={log.reason}>
                          {log.reason}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditSummary;
