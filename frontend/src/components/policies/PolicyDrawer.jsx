import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, ShieldCheck, Calendar, Target, Hash, Clock, Tag, Pencil, Trash2, Code2 } from 'lucide-react';
import { PriorityBadge, PolicyStatusBadge, EffectBadge } from './PolicyBadges';

const typeColors = {
  BUDGET: 'from-sky-500 to-blue-600',
  PERMISSION: 'from-violet-500 to-purple-600',
  ACCESS: 'from-emerald-500 to-teal-600',
  RATE_LIMIT: 'from-orange-500 to-red-500',
  AUDIT: 'from-pink-500 to-rose-600',
  GOVERNANCE: 'from-indigo-500 to-blue-600',
};
const getTypeColor = (type) => typeColors[type?.toUpperCase()] || 'from-gray-400 to-gray-600';

const MetaRow = ({ icon: Icon, label, value, valueEl }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 flex-shrink-0">
      <Icon className="h-3.5 w-3.5 text-gray-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      {valueEl ? (
        <div className="mt-0.5">{valueEl}</div>
      ) : (
        <p className="text-sm text-gray-800 mt-0.5 font-medium break-words">{value || '—'}</p>
      )}
    </div>
  </div>
);

const PolicyDrawer = ({ policy, onClose, onEdit, onDelete }) => {
  const color = policy ? getTypeColor(policy.policy_type) : '';

  return (
    <AnimatePresence>
      {policy && (
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
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">{policy.name}</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-3">
                {policy.description || 'No description provided.'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <PolicyStatusBadge isActive={policy.is_active} size="md" />
                <PriorityBadge priority={policy.priority} size="md" />
                <EffectBadge effect={policy.effect} />
              </div>
            </div>

            {/* Meta content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Policy Details</h3>
              <MetaRow icon={Hash} label="Policy ID" value={`#${policy.id}`} />
              <MetaRow icon={Tag} label="Type" value={policy.policy_type} />
              <MetaRow icon={Target} label="Target Resource" value={policy.target_resource} />
              {policy.rego_policy_name && (
                <MetaRow icon={Code2} label="Rego Policy" value={policy.rego_policy_name} />
              )}
              <MetaRow icon={Calendar} label="Created" value={policy.created_at ? format(new Date(policy.created_at), 'PPP') : '—'} />
              <MetaRow icon={Clock} label="Last Updated" value={policy.updated_at ? format(new Date(policy.updated_at), 'PPpp') : '—'} />
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => { onEdit(policy); onClose(); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => { onDelete(policy); onClose(); }}
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

export default PolicyDrawer;
