import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, Lock, Calendar, User, Bot, Hash, Clock, Pencil, Trash2, Shield } from 'lucide-react';
import { PermissionTypeBadge, PermissionStatusBadge } from './PermissionBadges';

const typeColors = {
  READ: 'from-sky-500 to-blue-600',
  WRITE: 'from-amber-500 to-orange-600',
  EXECUTE: 'from-violet-500 to-purple-600',
  ADMIN: 'from-red-500 to-rose-600',
};
const getColor = (perm) => typeColors[perm?.toUpperCase()] || 'from-gray-400 to-gray-600';

const MetaRow = ({ icon: Icon, label, value, valueEl }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 flex-shrink-0">
      <Icon className="h-3.5 w-3.5 text-gray-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      {valueEl ? <div className="mt-0.5">{valueEl}</div> : <p className="text-sm text-gray-800 mt-0.5 font-medium break-words">{value || '—'}</p>}
    </div>
  </div>
);

const PermissionDrawer = ({ permission, agents, onClose, onEdit, onDelete }) => {
  const color = permission ? getColor(permission.permission) : '';
  const agent = permission ? agents?.find((a) => a.id === permission.agent_id) : null;
  const agentName = agent?.name || `Agent #${permission?.agent_id}`;

  return (
    <AnimatePresence>
      {permission && (
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
            <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />

            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">{permission.permission} Access</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Permission grant for {agentName}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <PermissionTypeBadge permission={permission.permission} size="md" />
                <PermissionStatusBadge status="active" size="md" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Agent highlight */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 mb-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Assigned Agent</p>
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                    {agentName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{agentName}</p>
                    <p className="text-xs text-gray-400">ID #{permission.agent_id}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</h3>
              <MetaRow icon={Hash} label="Permission ID" value={`#${permission.id}`} />
              <MetaRow icon={User} label="User ID" value={`#${permission.user_id}`} />
              <MetaRow icon={Shield} label="Granted By" value={`User #${permission.granted_by}`} />
              <MetaRow icon={Calendar} label="Created" value={permission.created_at ? format(new Date(permission.created_at), 'PPP') : '—'} />
              <MetaRow icon={Clock} label="Last Updated" value={permission.updated_at ? format(new Date(permission.updated_at), 'PPpp') : '—'} />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { onEdit(permission); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => { onDelete(permission); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Revoke
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default PermissionDrawer;
