import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CreditCard, Bot, MoreHorizontal, Pencil, Trash2, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';
import StatusBadge, { getBudgetStatus } from './StatusBadge';
import ProgressBar from './ProgressBar';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

const formatCurrency = (val, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(val);
};

const BudgetCard = ({ budget, agents, onEdit, onDelete, onSelect, viewMode }) => {
  const agent = agents?.find((a) => a.id === budget.agent_id);
  const agentName = agent?.name || `Agent #${budget.agent_id}`;

  const monthlyLimit = Number(budget.monthly_limit);
  const monthlyUsed = Number(budget.monthly_used);
  const monthlyPct = monthlyLimit > 0 ? (monthlyUsed / monthlyLimit) * 100 : 0;
  const remaining = Math.max(0, monthlyLimit - monthlyUsed);

  const status = getBudgetStatus(monthlyUsed, monthlyLimit, budget.warning_threshold);

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
        className="group flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-100 last:border-0 cursor-pointer transition-colors"
        onClick={() => onSelect(budget)}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
          <CreditCard className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {agentName} Budget
          </h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            Agent: {agentName} · Currency: {budget.currency}
          </p>
        </div>

        <div className="hidden lg:block w-48 flex-shrink-0">
          <ProgressBar percentage={monthlyPct} />
        </div>

        <div className="flex-shrink-0 w-28 text-right">
          <p className="text-xs font-semibold text-gray-950">
            {formatCurrency(monthlyUsed, budget.currency)}
          </p>
          <p className="text-[10px] text-gray-400">
            of {formatCurrency(monthlyLimit, budget.currency)}
          </p>
        </div>

        <StatusBadge used={monthlyUsed} limit={monthlyLimit} warningThreshold={budget.warning_threshold} overrideStatus={budget.status} />

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(budget)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(budget)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2, boxShadow: '0 14px 42px rgba(0,0,0,0.09)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="group relative bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:border-gray-300 overflow-hidden cursor-pointer"
      onClick={() => onSelect(budget)}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shadow-sm flex-shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <StatusBadge used={monthlyUsed} limit={monthlyLimit} warningThreshold={budget.warning_threshold} overrideStatus={budget.status} />
            <Dropdown
              trigger={
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
            >
              <DropdownItem onClick={() => onEdit(budget)} className="flex items-center gap-2">
                <Pencil className="h-3.5 w-3.5 text-gray-500" />
                Edit Budget
              </DropdownItem>
              <div className="border-t border-gray-100 my-1" />
              <DropdownItem onClick={() => onDelete(budget)} className="flex items-center gap-2 text-red-600 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        {/* Title & Agent */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-1">
          {agentName} Budget
        </h3>
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Bot className="h-3.5 w-3.5" />
          <span className="truncate">{agentName}</span>
        </div>

        {/* Utilization Progress */}
        <div className="mb-4">
          <ProgressBar percentage={monthlyPct} />
        </div>

        {/* Limits Breakdown */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100/80 mb-4">
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Used</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">{formatCurrency(monthlyUsed, budget.currency)}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Remaining</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">{formatCurrency(remaining, budget.currency)}</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>Daily: {formatCurrency(budget.daily_limit, budget.currency)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{budget.created_at ? format(new Date(budget.created_at), 'MMM d') : '—'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetCard;
