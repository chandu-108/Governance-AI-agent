import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Pencil, Trash2, MoreHorizontal, Calendar, Target, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { PriorityBadge, PolicyStatusBadge, EffectBadge } from './PolicyBadges';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

const typeColors = {
  BUDGET: 'from-sky-500 to-blue-600',
  PERMISSION: 'from-violet-500 to-purple-600',
  ACCESS: 'from-emerald-500 to-teal-600',
  RATE_LIMIT: 'from-orange-500 to-red-500',
  AUDIT: 'from-pink-500 to-rose-600',
  GOVERNANCE: 'from-indigo-500 to-blue-600',
};
const getTypeColor = (type) => typeColors[type?.toUpperCase()] || 'from-gray-400 to-gray-600';

const TypeTag = ({ type }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
    <Tag className="h-2.5 w-2.5" />
    {type}
  </span>
);

const PolicyCard = ({ policy, onEdit, onDelete, onSelect, viewMode }) => {
  const color = getTypeColor(policy.policy_type);

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
        className="group flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-100 last:border-0 cursor-pointer transition-colors"
        onClick={() => onSelect(policy)}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{policy.name}</h3>
            <TypeTag type={policy.policy_type} />
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {policy.description || 'No description provided'}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <PolicyStatusBadge isActive={policy.is_active} />
          <PriorityBadge priority={policy.priority} />
          <EffectBadge effect={policy.effect} />
        </div>

        <span className="hidden md:block text-xs text-gray-400 flex-shrink-0 w-24 text-right">
          {policy.created_at ? format(new Date(policy.created_at), 'MMM d, yyyy') : '—'}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(policy)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(policy)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
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
      onClick={() => onSelect(policy)}
    >
      {/* Top accent */}
      <div className={`h-1 w-full bg-gradient-to-r ${color}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm flex-shrink-0`}>
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <PolicyStatusBadge isActive={policy.is_active} />
            <Dropdown
              trigger={
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
            >
              <DropdownItem onClick={() => onEdit(policy)} className="flex items-center gap-2">
                <Pencil className="h-3.5 w-3.5 text-gray-500" />
                Edit Policy
              </DropdownItem>
              <div className="border-t border-gray-100 my-1" />
              <DropdownItem onClick={() => onDelete(policy)} className="flex items-center gap-2 text-red-600 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        {/* Name + Type */}
        <div className="mb-1 flex items-center gap-2 flex-wrap">
          <TypeTag type={policy.policy_type} />
          <EffectBadge effect={policy.effect} />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-1">
          {policy.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 min-h-[2.25rem] leading-relaxed">
          {policy.description || 'No description provided for this policy.'}
        </p>

        {/* Target resource */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
          <Target className="h-3 w-3 flex-shrink-0" />
          <span className="truncate font-medium">{policy.target_resource}</span>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
          <PriorityBadge priority={policy.priority} />
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>{policy.created_at ? format(new Date(policy.created_at), 'MMM d') : '—'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PolicyCard;
