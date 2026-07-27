import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, Bot, Calendar, User, Hash, Clock, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

const avatarColors = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-blue-600',
];
const getColor = (id) => avatarColors[id % avatarColors.length];

const MetaRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100">
      <Icon className="h-3.5 w-3.5 text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-800 mt-0.5 font-medium">{value}</p>
    </div>
  </div>
);

const AgentDrawer = ({ agent, onClose, onEdit, onDelete }) => {
  const color = agent ? getColor(agent.id) : '';
  const initials = agent?.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AnimatePresence>
      {agent && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: { type: 'spring', stiffness: 280, damping: 28 } }}
            exit={{ x: '100%', transition: { duration: 0.2 } }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
          >
            {/* Top colored strip */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />

            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {initials}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">{agent.name}</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {agent.description || 'No description provided.'}
              </p>
              <div className="mt-3">
                <StatusBadge status={agent.status} size="md" />
              </div>
            </div>

            {/* Meta */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Agent Details
              </h3>
              <div>
                <MetaRow icon={Hash} label="Agent ID" value={`#${agent.id}`} />
                <MetaRow icon={User} label="Owner ID" value={`User #${agent.owner_id}`} />
                <MetaRow
                  icon={Calendar}
                  label="Created"
                  value={agent.created_at ? format(new Date(agent.created_at), 'PPP') : '—'}
                />
                <MetaRow
                  icon={Clock}
                  label="Last Updated"
                  value={agent.updated_at ? format(new Date(agent.updated_at), 'PPpp') : '—'}
                />
                <MetaRow icon={Bot} label="Status" value={agent.status} />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { onEdit(agent); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => { onDelete(agent); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AgentDrawer;
