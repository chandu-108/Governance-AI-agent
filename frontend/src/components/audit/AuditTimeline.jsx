import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ChevronRight, Activity } from 'lucide-react';
import { format } from 'date-fns';

const TimelineRow = ({ log, agents, onClick }) => {
  const isAllow = log.decision === 'ALLOW';
  const agent = agents.find(a => a.id === log.agent_id);
  const agentName = agent?.name || `Agent #${log.agent_id}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ backgroundColor: 'rgba(249,250,251,1)' }}
      className="relative pl-10 pr-4 py-6 group cursor-pointer transition-colors border-b border-gray-100 last:border-0"
      onClick={() => onClick(log)}
    >
      {/* Node */}
      <div className={`absolute left-[5px] top-7 w-7 h-7 rounded-full border-[3px] border-white flex items-center justify-center shadow-sm z-10 ${isAllow ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
        {isAllow ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isAllow ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {log.decision}
            </span>
            <span className="text-sm font-semibold text-gray-900">{log.action}</span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm font-medium text-gray-600 truncate">{agentName}</span>
          </div>
          
          <div className={`text-sm p-3 rounded-xl border ${isAllow ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-red-50/50 border-red-100 text-red-800'}`}>
            {log.reason || (isAllow ? 'Governance checks passed.' : 'Governance checks failed.')}
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              <Activity className="h-3.5 w-3.5 text-gray-400" />
              User #{log.user_id}
            </span>
            {log.ip_address && (
              <span>IP: {log.ip_address}</span>
            )}
          </div>
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start flex-shrink-0 text-right">
          <p className="text-xs font-semibold text-gray-900">{format(new Date(log.created_at), 'MMM d, yyyy')}</p>
          <p className="text-[11px] font-medium text-gray-500 mt-0.5">{format(new Date(log.created_at), 'HH:mm:ss.SSS')}</p>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
              View Details <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TableRow = ({ log, agents, onClick }) => {
  const isAllow = log.decision === 'ALLOW';
  const agent = agents.find(a => a.id === log.agent_id);
  const agentName = agent?.name || `Agent #${log.agent_id}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ backgroundColor: 'rgba(249,250,251,1)' }}
      className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0 cursor-pointer group"
      onClick={() => onClick(log)}
    >
      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex flex-col items-center justify-center flex-shrink-0">
        <span className="text-[9px] font-bold text-gray-400 leading-none uppercase">{format(new Date(log.created_at), 'MMM')}</span>
        <span className="text-xs font-bold text-gray-700 leading-none mt-0.5">{format(new Date(log.created_at), 'dd')}</span>
      </div>
      
      <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-3">
          <p className="text-sm font-semibold text-gray-900 truncate">{agentName}</p>
          <p className="text-xs text-gray-500 truncate">User #{log.user_id}</p>
        </div>
        <div className="col-span-3">
          <p className="text-sm font-medium text-gray-900 truncate">{log.action}</p>
        </div>
        <div className="col-span-4">
          <p className="text-sm text-gray-600 truncate pr-4">{log.reason || '—'}</p>
        </div>
        <div className="col-span-2 text-right flex items-center justify-end gap-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${isAllow ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {log.decision}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
};

const AuditTimeline = ({ logs, agents, onSelectLog, viewMode }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm relative">
      {viewMode === 'timeline' ? (
        <div className="relative p-2">
          {/* Vertical line connector */}
          <div className="absolute left-[26px] top-8 bottom-8 w-px bg-gray-100" />
          <AnimatePresence mode="popLayout">
            {logs.map((log) => (
              <TimelineRow key={log.id} log={log} agents={agents} onClick={onSelectLog} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div>
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex gap-4">
            <div className="w-8 flex-shrink-0" />
            <div className="flex-1 grid grid-cols-12 gap-4">
              <span className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent / User</span>
              <span className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</span>
              <span className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</span>
              <span className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pr-7">Decision</span>
            </div>
          </div>
          <AnimatePresence mode="popLayout">
            {logs.map((log) => (
              <TableRow key={log.id} log={log} agents={agents} onClick={onSelectLog} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AuditTimeline;
