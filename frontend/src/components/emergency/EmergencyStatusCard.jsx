import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle2, ShieldCheck, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

const EmergencyStatusCard = ({ status }) => {
  const isEmergency = status?.global_stop?.enabled;
  const updated = status?.global_stop?.updated_at;
  const enabledBy = status?.global_stop?.enabled_by;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-6">
      {/* Platform Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm relative overflow-hidden"
      >
        <div className={`absolute top-0 left-0 right-0 h-1 ${isEmergency ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-xl ${isEmergency ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {isEmergency ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Platform Status</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            {isEmergency ? (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </>
            )}
          </div>
          <span className={`text-2xl font-bold tracking-tight ${isEmergency ? 'text-red-600' : 'text-gray-900'}`}>
            {isEmergency ? 'EMERGENCY STOP' : 'OPERATIONAL'}
          </span>
        </div>
      </motion.div>

      {/* Agents Running */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
            <Activity className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Agent Stops</p>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-gray-900">{status?.agent_stops?.length || 0}</span>
          <span className="text-sm text-gray-500 ml-2">agents suspended</span>
        </div>
      </motion.div>

      {/* Last Triggered */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
            <Clock className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Last Status Update</p>
        </div>
        <div className="mt-4">
          <span className="text-lg font-bold text-gray-900">
            {updated ? format(new Date(updated), 'HH:mm:ss') : '--:--:--'}
          </span>
          <span className="text-xs text-gray-500 block mt-0.5">
            {updated ? format(new Date(updated), 'MMM d, yyyy') : 'No recent updates'}
          </span>
        </div>
      </motion.div>

      {/* Triggered By */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gray-100 text-gray-600">
            <User className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Modified By</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {enabledBy ? (
            <>
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                U{enabledBy}
              </div>
              <span className="text-sm font-medium text-gray-900">User ID #{enabledBy}</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">System Default</span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyStatusCard;
