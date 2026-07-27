import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, CreditCard, Calendar, Bot, Hash, Clock, User, DollarSign, ShieldAlert, ArrowUpRight, TrendingUp } from 'lucide-react';
import StatusBadge, { getBudgetStatus } from './StatusBadge';
import ProgressBar from './ProgressBar';

const formatCurrency = (val, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(val);
};

const MetaRow = ({ icon: Icon, label, value, valueEl }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 flex-shrink-0">
      <Icon className="h-3.5 w-3.5 text-gray-500" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      {valueEl ? <div className="mt-0.5">{valueEl}</div> : <p className="text-sm text-gray-800 mt-0.5 font-semibold break-words">{value || '—'}</p>}
    </div>
  </div>
);

const BudgetDrawer = ({ budget, agents, onClose, onEdit, onDelete }) => {
  const agent = budget ? agents?.find((a) => a.id === budget.agent_id) : null;
  const agentName = agent?.name || `Agent #${budget?.agent_id}`;

  const monthlyLimit = Number(budget?.monthly_limit || 0);
  const monthlyUsed = Number(budget?.monthly_used || 0);
  const monthlyRemaining = Math.max(0, monthlyLimit - monthlyUsed);
  const monthlyPct = monthlyLimit > 0 ? (monthlyUsed / monthlyLimit) * 100 : 0;

  const dailyLimit = Number(budget?.daily_limit || 0);
  const dailyUsed = Number(budget?.daily_used || 0);
  const dailyRemaining = Math.max(0, dailyLimit - dailyUsed);
  const dailyPct = dailyLimit > 0 ? (dailyUsed / dailyLimit) * 100 : 0;

  const status = budget ? getBudgetStatus(monthlyUsed, monthlyLimit, budget.warning_threshold) : 'HEALTHY';

  return (
    <AnimatePresence>
      {budget && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: { type: 'spring', stiffness: 280, damping: 28 } }}
            exit={{ x: '100%', transition: { duration: 0.2 } }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-indigo-600" />

            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shadow-sm flex-shrink-0">
                  <CreditCard className="h-7 w-7" />
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">{agentName} Budget</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Resource and spending cap configuration
              </p>
              <div className="mt-3 flex items-center gap-2">
                <StatusBadge used={monthlyUsed} limit={monthlyLimit} warningThreshold={budget.warning_threshold} overrideStatus={budget.status} size="md" />
                <span className="text-xs text-gray-400">Limit: {formatCurrency(monthlyLimit, budget.currency)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Progress visual */}
              <div className="space-y-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Monthly utilization</p>
                  <ProgressBar percentage={monthlyPct} />
                  <div className="flex justify-between text-xs mt-1.5 text-gray-500">
                    <span>Used: {formatCurrency(monthlyUsed, budget.currency)}</span>
                    <span>Remaining: {formatCurrency(monthlyRemaining, budget.currency)}</span>
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Daily utilization</p>
                  <ProgressBar percentage={dailyPct} />
                  <div className="flex justify-between text-xs mt-1.5 text-gray-500">
                    <span>Used: {formatCurrency(dailyUsed, budget.currency)}</span>
                    <span>Remaining: {formatCurrency(dailyRemaining, budget.currency)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Metadata</h3>
                <MetaRow icon={Hash} label="Budget ID" value={`#${budget.id}`} />
                <MetaRow icon={Bot} label="Assigned Agent" value={agentName} />
                <MetaRow icon={TrendingUp} label="Warning Threshold" value={`${budget.warning_threshold}%`} />
                <MetaRow icon={User} label="Created By" value={`User #${budget.created_by}`} />
                <MetaRow icon={Calendar} label="Last Reset" value={budget.last_reset ? format(new Date(budget.last_reset), 'PPP') : '—'} />
                <MetaRow icon={Calendar} label="Created At" value={budget.created_at ? format(new Date(budget.created_at), 'PPP') : '—'} />
                <MetaRow icon={Clock} label="Last Updated" value={budget.updated_at ? format(new Date(budget.updated_at), 'PPpp') : '—'} />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { onEdit(budget); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => { onDelete(budget); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default BudgetDrawer;
