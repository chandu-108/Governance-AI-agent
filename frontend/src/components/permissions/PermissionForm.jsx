import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Loader2, ChevronDown } from 'lucide-react';
import { agentsService } from '../../services/agents';

const schema = z.object({
  user_id: z.coerce.number().int().min(1, 'User ID is required'),
  agent_id: z.coerce.number().int().min(1, 'Agent is required'),
  permission: z.enum(['READ', 'WRITE', 'EXECUTE', 'ADMIN'], { required_error: 'Permission type is required' }),
});

const updateSchema = z.object({
  permission: z.enum(['READ', 'WRITE', 'EXECUTE', 'ADMIN'], { required_error: 'Permission type is required' }),
});

const inputCls = (hasError) =>
  `w-full px-3 py-2.5 text-sm bg-gray-50 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all ${
    hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'
  }`;

const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const PermissionForm = ({ open, onClose, onSubmit, permission, isLoading }) => {
  const isEdit = !!permission;

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsService.getAll,
    enabled: open,
    staleTime: 60_000,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(isEdit ? updateSchema : schema),
    defaultValues: isEdit
      ? { permission: 'READ' }
      : { user_id: '', agent_id: '', permission: 'READ' },
  });

  useEffect(() => {
    if (open) {
      if (permission) {
        reset({ permission: permission.permission });
      } else {
        reset({ user_id: '', agent_id: '', permission: 'READ' });
      }
    }
  }, [open, permission, reset]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
            exit={{ opacity: 0, scale: 0.96, y: 14, transition: { duration: 0.15 } }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
                  <Lock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {isEdit ? 'Edit Permission' : 'Assign Permission'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isEdit ? 'Change the permission level' : 'Grant agent access to a user'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
              {/* Assignment section (Create only) */}
              {!isEdit && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Assignment</p>
                  <div className="space-y-4">
                    <FormField label="User ID" required error={errors.user_id?.message}>
                      <input {...register('user_id')} type="number" min={1} placeholder="Enter user ID" className={inputCls(errors.user_id)} />
                    </FormField>

                    <FormField label="Agent" required error={errors.agent_id?.message}>
                      <div className="relative">
                        <select {...register('agent_id')} className={`${inputCls(errors.agent_id)} appearance-none pr-8`}>
                          <option value="">Select an agent…</option>
                          {agents.map((a) => (
                            <option key={a.id} value={a.id}>{a.name} (ID #{a.id})</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                      </div>
                    </FormField>
                  </div>
                </div>
              )}

              {/* Permission type */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Access Level</p>
                <FormField label="Permission Type" required error={errors.permission?.message}>
                  <div className="grid grid-cols-2 gap-2">
                    {['READ', 'WRITE', 'EXECUTE', 'ADMIN'].map((level) => {
                      const labelMap = { READ: '👁 Read', WRITE: '✏ Write', EXECUTE: '⚡ Execute', ADMIN: '🛡 Admin' };
                      const descMap = { READ: 'View only', WRITE: 'Modify data', EXECUTE: 'Run tasks', ADMIN: 'Full access' };
                      return (
                        <label
                          key={level}
                          className={`relative flex flex-col items-center p-3 rounded-xl border cursor-pointer transition-all ${
                            errors.permission ? 'border-red-200' : 'border-gray-200'
                          } hover:border-teal-300 hover:bg-teal-50/50 has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50 has-[:checked]:ring-1 has-[:checked]:ring-teal-500/20`}
                        >
                          <input type="radio" {...register('permission')} value={level} className="sr-only" />
                          <span className="text-sm font-medium text-gray-800">{labelMap[level]}</span>
                          <span className="text-xs text-gray-400 mt-0.5">{descMap[level]}</span>
                        </label>
                      );
                    })}
                  </div>
                </FormField>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit" disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl hover:from-teal-700 hover:to-emerald-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {isEdit ? 'Update Permission' : 'Assign Permission'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PermissionForm;
