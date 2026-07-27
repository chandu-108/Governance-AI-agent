import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Bot, MoreHorizontal, Pencil, Trash2, Calendar, User, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

const avatarColors = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-blue-600',
];

const getColor = (id) => avatarColors[id % avatarColors.length];

const AgentCard = ({ agent, onEdit, onDelete, onSelect, viewMode }) => {
  const initials = agent.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const color = getColor(agent.id);

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
        className="group flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-100 last:border-0 cursor-pointer transition-colors"
        onClick={() => onSelect(agent)}
      >
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{agent.name}</h3>
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {agent.description || 'No description provided'}
          </p>
        </div>

        <StatusBadge status={agent.status} />

        <span className="hidden md:block text-xs text-gray-400 flex-shrink-0 w-28 text-right">
          {agent.created_at ? format(new Date(agent.created_at), 'MMM d, yyyy') : '—'}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(agent)}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(agent)}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
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
      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.10)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="group relative bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:border-gray-300 overflow-hidden cursor-pointer"
      onClick={() => onSelect(agent)}
    >
      {/* Top accent strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${color}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
            {initials}
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <StatusBadge status={agent.status} />
            <Dropdown
              trigger={
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
            >
              <DropdownItem onClick={() => onEdit(agent)} className="flex items-center gap-2">
                <Pencil className="h-3.5 w-3.5 text-gray-500" />
                Edit Agent
              </DropdownItem>
              <div className="border-t border-gray-100 my-1" />
              <DropdownItem
                onClick={() => onDelete(agent)}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        {/* Agent name + description */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 truncate">
          {agent.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {agent.description || 'No description provided for this agent.'}
        </p>

        {/* Footer Meta */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">ID #{agent.owner_id}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 justify-end">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>{agent.created_at ? format(new Date(agent.created_at), 'MMM d') : '—'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentCard;
