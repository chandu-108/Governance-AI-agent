import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Pencil, Trash2, MoreHorizontal, Calendar, User, Bot, ArrowRight, Lock } from 'lucide-react';
import { PermissionTypeBadge, PermissionStatusBadge } from './PermissionBadges';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

const typeColors = {
  READ: 'from-sky-500 to-blue-600',
  WRITE: 'from-amber-500 to-orange-600',
  EXECUTE: 'from-violet-500 to-purple-600',
  ADMIN: 'from-red-500 to-rose-600',
};
const getColor = (perm) => typeColors[perm?.toUpperCase()] || 'from-gray-400 to-gray-600';

const PermissionCard = ({ permission, agents, onEdit, onDelete, onSelect, viewMode }) => {
  const color = getColor(permission.permission);
  const agent = agents?.find((a) => a.id === permission.agent_id);
  const agentName = agent?.name || `Agent #${permission.agent_id}`;
  const agentInitials = agentName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
        className="group flex items-center gap-4 px-5 py-4 bg-white border-b border-gray-100 last:border-0 cursor-pointer transition-colors"
        onClick={() => onSelect(permission)}
      >
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
          <Lock className="h-4 w-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {permission.permission} Access
            </h3>
            <span className="text-xs text-gray-400">→</span>
            <span className="text-xs text-gray-600 font-medium truncate">{agentName}</span>
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            User #{permission.user_id} · Granted by #{permission.granted_by}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <PermissionTypeBadge permission={permission.permission} />
          <PermissionStatusBadge status="active" />
        </div>

        <span className="hidden md:block text-xs text-gray-400 flex-shrink-0 w-24 text-right">
          {permission.created_at ? format(new Date(permission.created_at), 'MMM d, yyyy') : '—'}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(permission)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(permission)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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
      onClick={() => onSelect(permission)}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${color}`} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm flex-shrink-0`}>
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <PermissionTypeBadge permission={permission.permission} />
            <Dropdown
              trigger={
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
            >
              <DropdownItem onClick={() => onEdit(permission)} className="flex items-center gap-2">
                <Pencil className="h-3.5 w-3.5 text-gray-500" />
                Edit Permission
              </DropdownItem>
              <div className="border-t border-gray-100 my-1" />
              <DropdownItem onClick={() => onDelete(permission)} className="flex items-center gap-2 text-red-600 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
                Revoke
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2">
          {permission.permission} Access
        </h3>

        {/* Agent Row */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100 mb-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
            {agentInitials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{agentName}</p>
            <p className="text-xs text-gray-400">Assigned Agent</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <User className="h-3 w-3 flex-shrink-0" />
            <span>User #{permission.user_id}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>{permission.created_at ? format(new Date(permission.created_at), 'MMM d') : '—'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PermissionCard;
