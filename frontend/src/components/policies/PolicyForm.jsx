import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Loader2, ChevronDown } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  description: z.string().max(255, 'Max 255 characters').optional(),
  policy_type: z.string().min(1, 'Policy type is required'),
  target_resource: z.string().min(1, 'Target resource is required').max(100, 'Too long'),
  effect: z.enum(['ALLOW', 'DENY']),
  priority: z.coerce.number().int().min(0).max(10),
  rego_policy_name: z.string().max(100, 'Too long').optional(),
  is_active: z.boolean(),
});

const POLICY_TYPES = ['BUDGET', 'PERMISSION', 'ACCESS', 'RATE_LIMIT', 'AUDIT', 'GOVERNANCE'];

const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const inputCls = (hasError) =>
  `w-full px-3 py-2.5 text-sm bg-gray-50 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all ${
    hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'
  }`;

const PolicyForm = ({ open, onClose, onSubmit, policy, isLoading }) => {
  const isEdit = !!policy;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', description: '', policy_type: 'BUDGET',
      target_resource: '', effect: 'ALLOW', priority: 0,
      rego_policy_name: '', is_active: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (policy) {
        reset({
          name: policy.name, description: policy.description || '',
          policy_type: policy.policy_type, target_resource: policy.target_resource,
          effect: policy.effect, priority: policy.priority,
          rego_policy_name: policy.rego_policy_name || '', is_active: policy.is_active,
        });
      } else {
        reset({ name: '', description: '', policy_type: 'BUDGET', target_resource: '', effect: 'ALLOW', priority: 0, rego_policy_name: '', is_active: true });
      }
    }
  }, [open, policy, reset]);

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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {isEdit ? 'Edit Policy' : 'Create New Policy'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isEdit ? `Editing "${policy.name}"` : 'Define a new governance policy rule'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
              {/* Section: Basic */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Basic Information</p>
                <div className="space-y-4">
                  <FormField label="Policy Name" required error={errors.name?.message}>
                    <input {...register('name')} placeholder="e.g. Limit Daily API Calls" className={inputCls(errors.name)} />
                  </FormField>
                  <FormField label="Description" error={errors.description?.message}>
                    <textarea {...register('description')} placeholder="Describe what this policy enforces…" rows={2} className={`${inputCls(errors.description)} resize-none`} />
                  </FormField>
                </div>
              </div>

              {/* Section: Policy Config */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Policy Configuration</p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Policy Type" required error={errors.policy_type?.message}>
                    <div className="relative">
                      <select {...register('policy_type')} className={`${inputCls(errors.policy_type)} appearance-none pr-8`}>
                        {POLICY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </FormField>

                  <FormField label="Effect" required error={errors.effect?.message}>
                    <div className="relative">
                      <select {...register('effect')} className={`${inputCls(errors.effect)} appearance-none pr-8`}>
                        <option value="ALLOW">ALLOW</option>
                        <option value="DENY">DENY</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </FormField>

                  <FormField label="Target Resource" required error={errors.target_resource?.message}>
                    <input {...register('target_resource')} placeholder="e.g. trades, api, database" className={inputCls(errors.target_resource)} />
                  </FormField>

                  <FormField label="Priority (0–10)" error={errors.priority?.message}>
                    <input {...register('priority')} type="number" min={0} max={10} placeholder="0" className={inputCls(errors.priority)} />
                  </FormField>
                </div>
              </div>

              {/* Section: Advanced */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Advanced</p>
                <div className="space-y-4">
                  <FormField label="Rego Policy Name" error={errors.rego_policy_name?.message}>
                    <input {...register('rego_policy_name')} placeholder="e.g. budget_daily_limit" className={inputCls(errors.rego_policy_name)} />
                  </FormField>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Active</p>
                      <p className="text-xs text-gray-500">Enable this policy immediately</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input {...register('is_active')} type="checkbox" className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-violet-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit" disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {isEdit ? 'Save Changes' : 'Create Policy'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PolicyForm;
