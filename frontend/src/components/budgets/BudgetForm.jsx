import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Loader2, ChevronDown } from 'lucide-react';
import { agentsService } from '../../services/agents';

const schema = z.object({
  agent_id: z.coerce.number().int().min(1, 'Agent selection is required'),
  daily_limit: z.coerce.number().min(0.01, 'Daily limit must be greater than 0'),
  monthly_limit: z.coerce.number().min(0.01, 'Monthly limit must be greater than 0'),
  currency: z.string().min(1, 'Currency is required').max(10),
  warning_threshold: z.coerce.number().int().min(1).max(100, 'Threshold must be between 1 and 100'),
  status: z.enum(['ACTIVE', 'PAUSED']),
});

const updateSchema = z.object({
  daily_limit: z.coerce.number().min(0.01, 'Daily limit must be greater than 0'),
  monthly_limit: z.coerce.number().min(0.01, 'Monthly limit must be greater than 0'),
  currency: z.string().min(1, 'Currency is required').max(10),
  warning_threshold: z.coerce.number().int().min(1).max(100, 'Threshold must be between 1 and 100'),
  status: z.enum(['ACTIVE', 'PAUSED']),
});

const inputCls = (hasError) =>
  `w-full px-3 py-2.5 text-sm bg-gray-50 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all ${
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

const BudgetForm = ({ open, onClose, onSubmit, budget, isLoading }) => {
  const isEdit = !!budget;

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsService.getAll,
    enabled: open,
    staleTime: 60_000,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(isEdit ? updateSchema : schema),
    defaultValues: {
      agent_id: '', daily_limit: '', monthly_limit: '',
      currency: 'USD', warning_threshold: 80, status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (open) {
      if (budget) {
        reset({
          daily_limit: Number(budget.daily_limit),
          monthly_limit: Number(budget.monthly_limit),
          currency: budget.currency,
          warning_threshold: budget.warning_threshold,
          status: budget.status === 'EXCEEDED' ? 'ACTIVE' : budget.status, // EXCEEDED resets to ACTIVE on manual edit
        });
      } else {
        reset({ agent_id: '', daily_limit: '', monthly_limit: '', currency: 'USD', warning_threshold: 80, status: 'ACTIVE' });
      }
    }
  }, [open, budget, reset]);

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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {isEdit ? 'Edit Budget' : 'Configure Budget'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isEdit ? 'Update allocation limits' : 'Establish budget caps for an agent'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
              {/* Agent selection (Create mode only) */}
              {!isEdit && (
                <FormField label="Assign to Agent" required error={errors.agent_id?.message}>
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
              )}

              {/* Currency & Thresholds */}
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Currency" required error={errors.currency?.message}>
                  <input {...register('currency')} placeholder="USD" className={inputCls(errors.currency)} />
                </FormField>

                <FormField label="Warning Threshold (%)" required error={errors.warning_threshold?.message}>
                  <input {...register('warning_threshold')} type="number" min={1} max={100} placeholder="80" className={inputCls(errors.warning_threshold)} />
                </FormField>
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Daily Limit" required error={errors.daily_limit?.message}>
                  <input {...register('daily_limit')} type="number" step="0.01" placeholder="100.00" className={inputCls(errors.daily_limit)} />
                </FormField>

                <FormField label="Monthly Limit" required error={errors.monthly_limit?.message}>
                  <input {...register('monthly_limit')} type="number" step="0.01" placeholder="1000.00" className={inputCls(errors.monthly_limit)} />
                </FormField>
              </div>

              {/* Status */}
              <FormField label="Status" required error={errors.status?.message}>
                <div className="relative">
                  <select {...register('status')} className={`${inputCls(errors.status)} appearance-none pr-8`}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PAUSED">PAUSED</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </FormField>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit" disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {isEdit ? 'Save Changes' : 'Allocate Budget'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BudgetForm;
